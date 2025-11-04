import sys
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression

# =====================================================
# 0️⃣ Leitura do argumento vindo do Node (período)
# =====================================================
period = "30d"
if len(sys.argv) > 1:
    period = sys.argv[1]

print(f"🕒 Período recebido: {period}")

# Define os arquivos
orders_file = f"orders_{period}.json"
customers_file = f"customers_{period}.json"
campaigns_file = "campaigns.json"

# =====================================================
# 1️⃣ Leitura dos JSONs
# =====================================================
def load_json(file_path):
    try:
        with open(file_path, encoding="utf-8") as f:
            return pd.json_normalize(json.load(f))
    except FileNotFoundError:
        print(f"⚠️ Arquivo não encontrado: {file_path}")
        return pd.DataFrame()

orders = load_json(orders_file)
customers = load_json(customers_file)
campaigns = load_json(campaigns_file)

# =====================================================
# 2️⃣ Conversões e validações básicas
# =====================================================
if "lastOrder" in customers.columns:
    customers["lastOrder"] = pd.to_datetime(customers["lastOrder"], errors="coerce")
if "delivery.deliveryDateTime" in orders.columns:
    orders["delivery.deliveryDateTime"] = pd.to_datetime(orders["delivery.deliveryDateTime"], errors="coerce")

# =====================================================
# 3️⃣ Indicadores gerais
# =====================================================
ticket_medio = round(customers["avgTicket"].mean(), 2) if "avgTicket" in customers else 0
receita_total = round(customers["totalSpent"].sum(), 2) if "totalSpent" in customers else 0
clientes_ativos = customers[customers["status"] == "Active"].shape[0] if "status" in customers else 0
clientes_inativos = customers[customers["status"] == "Inactive"].shape[0] if "status" in customers else 0

# =====================================================
# 4️⃣ Fidelização e comportamento (taxa dinâmica e reativados)
# =====================================================
hoje = datetime.now()

# Define o limite de dias conforme o período
if period == "30d":
    limite_dias = 30
    periodo_anterior = "60d"
elif period == "60d":
    limite_dias = 60
    periodo_anterior = "90d"
elif period == "90d":
    limite_dias = 90
    periodo_anterior = None  # não há anterior
else:
    limite_dias = 30
    periodo_anterior = None

# Calcula inatividade
if "lastOrder" in customers.columns and len(customers) > 0:
    clientes_inativos_periodo = customers[customers["lastOrder"] < (hoje - timedelta(days=limite_dias))].shape[0]
    taxa_inatividade = round((clientes_inativos_periodo / len(customers)) * 100, 2)
else:
    clientes_inativos_periodo = 0
    taxa_inatividade = 0

# === Clientes reativados (voltaram neste período) ===
clientes_reativados = 0
if periodo_anterior:
    try:
        old_customers = pd.json_normalize(json.load(open(f"customers_{periodo_anterior}.json", encoding="utf-8")))
        old_customers["lastOrder"] = pd.to_datetime(old_customers["lastOrder"], errors="coerce")

        # IDs que estavam inativos antes e aparecem agora com compra recente
        cutoff_old = hoje - timedelta(days=limite_dias * 1.5)
        inativos_antes = old_customers[old_customers["lastOrder"] < cutoff_old]["id"].tolist()
        reativados = customers[
            (customers["id"].isin(inativos_antes)) &
            (customers["lastOrder"] >= (hoje - timedelta(days=limite_dias * 1.2)))
        ]
        clientes_reativados = reativados.shape[0]
    except FileNotFoundError:
        clientes_reativados = 0

# =====================================================
# 5️⃣ Previsão simples de receita (7 dias)
# =====================================================
if not customers.empty and "totalSpent" in customers:
    clientes_sorted = customers.sort_values("totalSpent", ascending=True)
    dias = np.arange(len(clientes_sorted)).reshape(-1, 1)
    receitas = clientes_sorted["totalSpent"].values

    modelo = LinearRegression().fit(dias, receitas)
    dias_futuros = np.arange(len(clientes_sorted), len(clientes_sorted) + 7).reshape(-1, 1)
    previsao_receita = modelo.predict(dias_futuros).clip(min=0)
    datas_previstas = [hoje + timedelta(days=i + 1) for i in range(7)]

    previsao_df = pd.DataFrame({
        "data": datas_previstas,
        "receita_prevista": previsao_receita.round(2)
    })
else:
    previsao_df = pd.DataFrame()

# =====================================================
# 6️⃣ Campanhas inteligentes e recomendações
# =====================================================
clientes_vip = customers[customers["isVIP"] == True].shape[0] if "isVIP" in customers else 0
clientes_fieis = customers[customers["segment"].str.lower() == "loyal"].shape[0] if "segment" in customers else 0
churn_total = customers[customers["churnRisk"] == True].shape[0] if "churnRisk" in customers else 0

campanhas_inteligentes = {
    "Reativação": int(clientes_reativados),
    "Fidelização": int(clientes_fieis),
    "VIPs": int(clientes_vip),
    "Churn Risk": int(churn_total),
}

recomendacoes = []
if clientes_inativos_periodo > 0:
    recomendacoes.append(f"Envie a campanha 'Volte e Ganhe 10%' para {clientes_inativos_periodo} clientes inativos.")
if clientes_reativados > 0:
    recomendacoes.append(f"Parabenize os {clientes_reativados} clientes reativados com um cupom de desconto.")
if clientes_fieis > 0:
    recomendacoes.append(f"Crie um programa de pontos para {clientes_fieis} clientes fiéis.")
if clientes_vip > 0:
    recomendacoes.append(f"Ofereça benefícios exclusivos para {clientes_vip} clientes VIP.")
if churn_total > 0:
    recomendacoes.append(f"Crie uma campanha de retenção para {churn_total} clientes em risco de churn.")

# =====================================================
# 7️⃣ Métricas das campanhas
# =====================================================
if not campaigns.empty and "conversionRate" in campaigns.columns:
    media_conversao = round(campaigns["conversionRate"].mean() * 100, 2)
    melhor = campaigns.loc[campaigns["conversionRate"].idxmax()]
    pior = campaigns.loc[campaigns["conversionRate"].idxmin()]
    campanha_insights = {
        "taxa_conversao_media": media_conversao,
        "melhor_campanha": {
            "nome": melhor.get("name", "N/A"),
            "taxa_conversao": f"{melhor.get('conversionRate', 0) * 100:.1f}%",
        },
        "pior_campanha": {
            "nome": pior.get("name", "N/A"),
            "taxa_conversao": f"{pior.get('conversionRate', 0) * 100:.1f}%",
        },
    }
else:
    campanha_insights = {}

# =====================================================
# 8️⃣ JSON final — formato para o React
# =====================================================
insights = {
    "restaurante": "La Pasticceria Cannoli",
    "resumo_geral": {
        "ticket_medio": ticket_medio,
        "receita_total": receita_total,
        "clientes_ativos": clientes_ativos,
        "clientes_inativos": clientes_inativos_periodo,
        "clientes_reativados": clientes_reativados,
        "taxa_inatividade": taxa_inatividade,
    },
    "previsao_receita": previsao_df.to_dict(orient="records"),
    "campanhas_inteligentes": campanhas_inteligentes,
    "campanha_insights": campanha_insights,
    "recomendacoes": recomendacoes,
}

# =====================================================
# 9️⃣ Exporta e imprime
# =====================================================
def convert(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Tipo não serializável: {type(obj)}")

print(json.dumps(insights, indent=4, ensure_ascii=False, default=convert))

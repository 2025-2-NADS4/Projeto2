import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Executa o script Python e retorna o JSON de insights.
 * @param {string} period - Ex: "30d", "60d", "90d"
 * @param {string} userRole - "admin" ou "client"
 */
export function getInsights(period = "30d", userRole = "client") {
  return new Promise((resolve, reject) => {
    const scriptName =
      userRole === "admin" ? "insights_admin.py" : "insights_from_json.py";
    const scriptPath = path.resolve(__dirname, `../python/${scriptName}`);

    console.log(`🧠 Executando script Python: ${scriptName}`);

    const python = spawn("python", [scriptPath, period], {
      cwd: path.resolve(__dirname, "../python"),
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
    });

    let data = "";
    let error = "";

    // 🟢 captura a saída padrão (stdout)
    python.stdout.on("data", (chunk) => {
      data += chunk.toString("utf-8");
    });

    // 🔴 captura mensagens de erro (stderr)
    python.stderr.on("data", (chunk) => {
      error += chunk.toString("utf-8");
    });

    // ⚙️ quando o script termina
    python.on("close", (code) => {
      if (code !== 0) {
        console.error("❌ Erro do Python:", error);
        return reject(new Error(error || "Erro ao executar script Python"));
      }

      try {
        // 🧩 limpa o output e isola o JSON (ignora prints ou logs)
        const cleaned = data.trim();
        const jsonMatch = cleaned.match(/\{[\s\S]*\}$/); // pega o último JSON completo
        if (!jsonMatch) {
          throw new Error("Nenhum JSON encontrado na saída do Python.");
        }

        const parsed = JSON.parse(jsonMatch[0]);
        console.log("✅ JSON recebido do Python com sucesso!");
        resolve(parsed);
      } catch (err) {
        console.error("⚠️ Falha ao converter JSON:", err);
        console.log("🪵 Saída completa do Python:", data);
        reject(err);
      }
    });
  });
}

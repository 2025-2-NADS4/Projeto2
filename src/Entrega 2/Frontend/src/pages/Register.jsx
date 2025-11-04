import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import { Sun, Moon } from "lucide-react";
import { registerUser } from "../api/authApi";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const { isDark, toggleTheme, themeClasses } = useTheme();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!nome || !email || !senha || !confirmarSenha)
      return setErro("Preencha todos os campos.");

    if (senha !== confirmarSenha)
      return setErro("As senhas não coincidem.");

    try {
      await registerUser({ name: nome, email, password: senha, role: "client" });
      alert("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (err) {
      setErro("Erro ao cadastrar: " + err.message);
    }
  };

  return (
    <div
      className={`${themeClasses.bg} ${themeClasses.text} relative min-h-screen flex items-center justify-center transition-colors duration-500 overflow-hidden`}
    >
      {/* === BLOCO LARANJA À DIREITA (DESKTOP) === */}
      <div className="hidden md:flex absolute right-0 top-0 h-full w-[520px] bg-gradient-to-b from-[#E97719] to-[#d66b12] rounded-l-[200px] flex-col items-center justify-center text-white px-10 shadow-2xl">
        <h2 className="text-3xl font-bold mb-4">Bem-vindo, de volta</h2>
        <p className="mb-6 text-sm">Já possui uma conta?</p>
        <button
          onClick={() => navigate("/login")}
          className="border border-white px-8 py-2 rounded-full text-white hover:bg-white hover:text-[#E97719] transition font-medium"
        >
          Login
        </button>
      </div>

      {/* === BLOCO LARANJA (MOBILE - topo) === */}
      <div className="md:hidden absolute top-0 left-0 w-full h-[200px] bg-gradient-to-r from-[#E97719] to-[#d66b12] flex flex-col items-center justify-center text-white shadow-lg rounded-b-[80px]">
        <h2 className="text-xl font-semibold mb-1">Bem-vindo, de volta</h2>
        <button
          onClick={() => navigate("/login")}
          className="border border-white px-6 py-1 rounded-full text-sm text-white hover:bg-white hover:text-[#E97719] transition font-medium"
        >
          Login
        </button>
      </div>

      {/* === CARD DE CADASTRO CENTRAL (empurrado pra esquerda no desktop) === */}
      <form
        onSubmit={handleRegister}
        className={`${themeClasses.card} border ${themeClasses.border} relative z-10 p-8 rounded-2xl w-[90%] max-w-md shadow-lg transition-colors duration-500 md:mr-[300px] md:mt-0 mt-[220px]`}
      >
        {/* Toggle de tema */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-full border ${themeClasses.border} hover:scale-105 transition-transform`}
          >
            {isDark ? (
              <Sun className="text-[#FFD700]" />
            ) : (
              <Moon className="text-[#FF8C00]" />
            )}
          </button>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-[#FFD700] to-[#FF8C00] bg-clip-text text-transparent">
          Criar conta
        </h2>

        {erro && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg p-2 mb-4 text-center">
            {erro}
          </div>
        )}

        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={`w-full mb-4 p-3 rounded-lg bg-transparent border ${themeClasses.border} focus:outline-none focus:border-[#FFD700]`}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full mb-4 p-3 rounded-lg bg-transparent border ${themeClasses.border} focus:outline-none focus:border-[#FFD700]`}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className={`w-full mb-4 p-3 rounded-lg bg-transparent border ${themeClasses.border} focus:outline-none focus:border-[#FFD700]`}
        />
        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          className={`w-full mb-6 p-3 rounded-lg bg-transparent border ${themeClasses.border} focus:outline-none focus:border-[#FFD700]`}
        />

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-white font-medium"
        >
          Cadastrar
        </button>

        <p className={`text-center text-sm mt-4 ${themeClasses.muted}`}>
          Já tem conta?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#FF8C00] cursor-pointer hover:underline"
          >
            Entrar
          </span>
        </p>
      </form>
    </div>
  );
}

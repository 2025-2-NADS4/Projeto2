import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import { Sun, Moon } from "lucide-react";
import { loginUser } from "../api/authApi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const { isDark, toggleTheme, themeClasses } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password: senha });
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      className={`${themeClasses.bg} ${themeClasses.text} relative min-h-screen flex items-center justify-center transition-colors duration-500 overflow-hidden`}
    >
      {/* === BLOCO LARANJA À ESQUERDA (DESKTOP) === */}
      <div className="hidden md:flex absolute left-0 top-0 h-full w-[520px] bg-gradient-to-b from-[#E97719] to-[#d66b12] rounded-r-[200px] flex-col items-center justify-center text-white px-10 shadow-2xl">
        <h2 className="text-3xl font-bold mb-4">Olá, seja bem-vindo</h2>
        <p className="mb-6 text-sm">Ainda não tem uma conta?</p>
        <button
          onClick={() => navigate("/register")}
          className="border border-white px-8 py-2 rounded-lg text-white hover:bg-white hover:text-[#E97719] transition font-medium"
        >
          Criar Conta
        </button>
      </div>

      {/* === BLOCO LARANJA (MOBILE no topo) === */}
      <div className="md:hidden absolute top-0 left-0 w-full h-[200px] bg-gradient-to-r from-[#E97719] to-[#d66b12] flex flex-col items-center justify-center text-white shadow-lg rounded-b-[80px]">
        <h2 className="text-xl font-semibold mb-1">Olá, seja bem-vindo</h2>
        <button
          onClick={() => navigate("/register")}
          className="border border-white px-6 py-1 rounded-lg text-sm text-white hover:bg-white hover:text-[#E97719] transition font-medium"
        >
          Criar Conta
        </button>
      </div>

      {/* === CARD DE LOGIN CENTRAL === */}
      <form
        onSubmit={handleLogin}
        className={`${themeClasses.card} border ${themeClasses.border} relative z-10 p-8 rounded-2xl w-[90%] max-w-md shadow-lg transition-colors duration-500 md:ml-[300px] md:mt-0 mt-[220px]`}
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
          Entrar
        </h2>

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
          className={`w-full mb-6 p-3 rounded-lg bg-transparent border ${themeClasses.border} focus:outline-none focus:border-[#FFD700]`}
        />

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-white font-medium"
        >
          Acessar
        </button>

        <p className={`text-center text-sm mt-4 ${themeClasses.muted}`}>
          Ainda não tem conta?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-[#FF8C00] cursor-pointer hover:underline"
          >
            Cadastre-se
          </span>
        </p>
      </form>
    </div>
  );
}

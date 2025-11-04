import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sun, Moon, LogOut } from "lucide-react";

export default function Header({
  isDark,
  toggleTheme,
  selectedPeriod,
  setSelectedPeriod,
  restaurant,
  muted,
  border,
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

 const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};


  return (
    <header
      className={`flex justify-between items-center px-8 py-4 border-b ${border} ${
        isDark ? "bg-[#0F0F0F]/80" : "bg-white/90"
      } backdrop-blur-md sticky top-0 z-50`}
    >
      {/* logo */}
      <div className="flex items-center gap-3">
        <img src="/logo-eleavere.svg" alt="Eleavere" className="h-8" />
        <span
          className={`font-semibold tracking-wide ${
            isDark ? "text-[#00BFA6]" : "text-[#FF8C00]"
          }`}
        >
          Eleavere Analytics
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Botões de período */}
        <div className="hidden sm:flex gap-2">
          {["30d", "60d", "90d"].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedPeriod === p
                  ? "bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-white"
                  : isDark
                  ? "bg-[#1C1C1C] text-[#B0B0B0] hover:text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Modo claro/escuro */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full border ${border} hover:scale-105 transition-transform`}
        >
          {isDark ? <Sun className="text-[#FFD700]" /> : <Moon className="text-[#FF8C00]" />}
        </button>

        {/* Avatar + menu */}
        <div className="relative">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="User"
            className={`w-9 h-9 rounded-full border cursor-pointer ${
              isDark ? "border-[#FFD700]" : "border-[#FF8C00]"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          />

          {menuOpen && (
            <div
              className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border ${border} ${
                isDark ? "bg-[#1C1C1C]" : "bg-white"
              }`}
            >
              <button
                onClick={() => navigate("/perfil")}
                className="w-full text-left px-4 py-2 hover:bg-[#FF8C00]/10 text-sm"
              >
                Meu Perfil
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-500/10 text-sm flex items-center gap-2"
              >
                <LogOut size={14} /> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

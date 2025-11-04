import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ isDark, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border hover:scale-105 transition-transform border-gray-300"
    >
      {isDark ? <Sun className="text-[#FFD700]" /> : <Moon className="text-[#FF8C00]" />}
    </button>
  );
}

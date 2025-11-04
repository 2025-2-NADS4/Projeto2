export default function Footer({ muted, border }) {
  return (
    <footer className={`text-center py-6 ${muted} text-sm border-t ${border}`}>
      Desenvolvido por <span className="text-[#00BFA6] font-medium">Eleavere</span> para{" "}
      <span className="text-[#FF8C00] font-medium">Cannoli Foodtech</span> ·
      FECAP Data Project 2025
    </footer>
  );
}

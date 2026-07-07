export default function Footer() {
  return (
    <>
      <footer className="border-t border-white/[0.05] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center"></div>
            <span className="text-sm font-semibold text-white/60">Solirna AI</span>
          </div>
          <p className="text-sm text-white/25">&copy; {new Date().getFullYear()} Solirna AI</p>
        </div>
      </footer>
    </>
  );
}

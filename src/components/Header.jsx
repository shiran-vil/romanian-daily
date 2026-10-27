export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
        <div className="flex h-10 w-10 shrink-0 overflow-hidden rounded-xl shadow-sm" aria-hidden="true">
          <span className="w-1/3 bg-[#002B7F]" />
          <span className="w-1/3 bg-[#FCD116]" />
          <span className="w-1/3 bg-[#CE1126]" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold leading-tight text-slate-900 sm:text-xl dark:text-white">
            <span lang="ro">Română</span> B1 Practice
          </h1>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">ILR-standard daily practice, writing feedback and drills</p>
        </div>
      </div>
    </header>
  );
}

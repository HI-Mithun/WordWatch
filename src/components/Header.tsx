interface HeaderProps {
  wordCount: number
}

function Header({ wordCount }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-200 px-6 dark:border-zinc-800">
      <h1 className="text-lg font-semibold tracking-tight">
        WordWatch
      </h1>

      <span className="text-sm text-zinc-500">
        {wordCount.toLocaleString()} words
      </span>
    </header>
  )
}

export default Header
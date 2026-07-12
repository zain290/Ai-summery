export function Footer() {
  return (
    <footer className="border-t border-nav-border py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <nav className="flex flex-col gap-3">
          <a href="/" className="text-muted hover:text-text transition-colors">Showcase</a>
          <a href="/create" className="text-muted hover:text-text transition-colors">Create</a>
          <a href="/gallery" className="text-muted hover:text-text transition-colors">Gallery</a>
        </nav>
        <div className="flex items-center justify-end">
          <span className="text-4xl font-bold text-text">ALPHA</span>
        </div>
      </div>
    </footer>
  )
}

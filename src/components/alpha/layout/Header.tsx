import { useState } from 'react'
import { Link } from 'react-router-dom'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-header-bg backdrop-blur-md border-b border-nav-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-text">
          ALPHA
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/" className="text-muted hover:text-text transition-colors">Home</Link>
          <Link to="/create" className="text-muted hover:text-text transition-colors">Create</Link>
          <Link to="/gallery" className="text-muted hover:text-text transition-colors">Gallery</Link>
        </nav>

        <button
          className="lg:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="block w-6 h-0.5 bg-text mb-1.5" />
          <span className="block w-6 h-0.5 bg-text mb-1.5" />
          <span className="block w-6 h-0.5 bg-text" />
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-nav-border bg-background">
          <nav className="flex flex-col p-4 gap-4">
            <Link to="/" className="text-muted hover:text-text" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/create" className="text-muted hover:text-text" onClick={() => setMenuOpen(false)}>Create</Link>
            <Link to="/gallery" className="text-muted hover:text-text" onClick={() => setMenuOpen(false)}>Gallery</Link>
          </nav>
        </div>
      )}
    </header>
  )
}

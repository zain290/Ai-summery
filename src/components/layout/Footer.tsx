export function Footer() {
  return (
    <footer className="border-t border-white/10 py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center text-text-muted text-sm">
        &copy; {new Date().getFullYear()} AI Summariser. Powered by Groq.
      </div>
    </footer>
  )
}

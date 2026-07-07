export function LoadingSpinner({ message = 'Generating summary...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin" />
      </div>
      <p className="text-text-muted text-sm">{message}</p>
    </div>
  )
}

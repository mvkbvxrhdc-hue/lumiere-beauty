export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="h-12 w-64 animate-pulse rounded-lg bg-gray-200" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-96 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    </div>
  )
}

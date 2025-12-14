export function Step({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="flex items-center gap-3 text-lg font-semibold">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {number}
        </span>
        {title}
      </h3>
      
      <div className="mt-4 pl-11">{children}</div>
    </div>
  )
}
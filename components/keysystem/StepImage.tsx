export function StepImage({
  src,
  alt,
  width = 400,
  className = "",
  divClassName = ""
}: {
  src: string
  alt?: string
  width?: number
  className?: string
  divClassName?: string
}) {
  return (
    <div className={"my-6 flex justify-center " + (divClassName ?? "")}>
      <img
        src={src}
        alt={alt}
        width={width}
        className={"rounded-lg border shadow-sm " + (className ?? "")}
      />
    </div>
  )
}
export default function ObsidianImage({
  /*image,
  transparency,
  scaleType,
  color,
  rectOffset,*/
  height,
  bgTransparency,
}: //rectSize,
{
  image: string;
  transparency: number;
  scaleType: string;
  color: { b: number; g: number; r: number };
  rectOffset: { y: number; x: number };
  height: number;
  rectSize: { y: number; x: number };
  bgTransparency: number;
}) {
  return (
    <div
      className={"w-full rounded-[1px] border flex items-center justify-center"}
      style={{
        height: `${height}px`,
        backgroundColor: `rgba(25,25,25,${1 - bgTransparency})`,
        borderColor: `rgba(40,40,40,${1 - bgTransparency})`,
      }}
    >
      <p className="text-center text-muted-foreground text-sm select-none">
        Image Unavailable
      </p>
    </div>
  );
}

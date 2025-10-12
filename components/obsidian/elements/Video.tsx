export default function ObsidianVideo({
  /* video,
  looped,
  playing,
  volume, */
  height,
}: {
  video: string;
  looped: boolean;
  playing: boolean;
  volume: number;
  height: number;
}) {
  return (
    <div
      className="w-full rounded-[1px] bg-[rgb(25,25,25)] border-[rgb(40,40,40)] border flex items-center justify-center"
      style={{ height: `${height}px` }}
    >
      <p className="text-center text-muted-foreground text-sm select-none">
        Video Unavailable
      </p>
    </div>
  );
}

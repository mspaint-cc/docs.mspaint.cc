"use client";

import ObsidianVideo from "@/components/obsidian/elements/Video";
import { Input } from "@/components/ui/input";
import { Label as LabelPrimitive } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMemo, useState } from "react";
import { CopyPseudoComponent } from "./shared/CopyComponent";

function escapeLuaString(input: string) {
  return input
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/"/g, '\\"');
}

export default function VideoPlayground() {
  const [videoUrl, setVideoUrl] = useState("rbxassetid://1234567890");
  const [looped, setLooped] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [height, setHeight] = useState(200);

  const pseudoCode = useMemo(() => {
    const lines = [`    Video = "${escapeLuaString(videoUrl)}",`];

    if (looped) {
      lines.push("    Looped = true,");
    }

    if (playing) {
      lines.push("    Playing = true,");
    }

    if (volume !== 1) {
      lines.push(`    Volume = ${Number(volume.toFixed(2))},`);
    }

    if (height !== 200) {
      lines.push(`    Height = ${height},`);
    }

    return ['Groupbox:AddVideo("MyVideo", {', ...lines, "})"].join("\n");
  }, [height, looped, playing, videoUrl, volume]);

  const safeGeneratePseudoCode = () => pseudoCode;

  return (
    <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[360px] relative">
      <CopyPseudoComponent codegenfunc={safeGeneratePseudoCode} />

      <div className="flex items-center justify-center min-h-[200px] relative w-full">
        <div className="max-w-[200px] w-[200px] mb-5">
          <ObsidianVideo
            video={videoUrl}
            looped={looped}
            playing={playing}
            volume={volume}
            height={height}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="video-url">
            Video URL or asset
          </LabelPrimitive>
          <Input
            id="video-url"
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="video-height">Height (px)</LabelPrimitive>
          <Input
            id="video-height"
            type="number"
            value={height}
            onChange={(event) => {
              const parsed = Number(event.target.value);
              setHeight(Number.isFinite(parsed) ? Math.max(parsed, 0) : 200);
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="video-volume">Volume</LabelPrimitive>
          <Input
            id="video-volume"
            type="number"
            step={0.1}
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
          />
        </div>

        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="video-looped">Looped</LabelPrimitive>
          <div className="flex items-center gap-2">
            <Switch
              id="video-looped"
              checked={looped}
              onCheckedChange={setLooped}
            />
            <span className="text-sm text-muted-foreground">
              Restart automatically when finished.
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="video-playing">Playing</LabelPrimitive>
          <div className="flex items-center gap-2">
            <Switch
              id="video-playing"
              checked={playing}
              onCheckedChange={setPlaying}
            />
            <span className="text-sm text-muted-foreground">
              Start playback immediately.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

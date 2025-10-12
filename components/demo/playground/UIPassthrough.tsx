"use client";

import ObsidianUIPassthrough from "@/components/obsidian/elements/UIPassthrough";
import { Input } from "@/components/ui/input";
import { Label as LabelPrimitive } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMemo, useState } from "react";
import { CopyPseudoComponent } from "./shared/CopyComponent";

const DEFAULT_HEIGHT = 24;

export default function UIPassthroughPlayground() {
  const [instanceName, setInstanceName] = useState("CustomFrame");
  const [height, setHeight] = useState(120);
  const [visible, setVisible] = useState(true);

  const pseudoCode = useMemo(() => {
    const lines = [
      `    Instance = ${instanceName.trim() || "CustomFrame"},`,
    ];

    if (height !== DEFAULT_HEIGHT) {
      lines.push(`    Height = ${height},`);
    }

    if (!visible) {
      lines.push("    Visible = false,");
    }

    return [
      'Groupbox:AddUIPassthrough("CustomUI", {',
      ...lines,
      "})",
    ].join("\n");
  }, [height, instanceName, visible]);

  const safeGeneratePseudoCode = () => pseudoCode;

  return (
    <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[360px] relative">
      <CopyPseudoComponent codegenfunc={safeGeneratePseudoCode} />

      <div className="flex items-center justify-center min-h-[200px] relative w-full">
        <div className="max-w-[200px] w-[200px] mb-5">
          <ObsidianUIPassthrough
            instanceName={instanceName.trim() || "CustomFrame"}
            height={height}
            visible={visible}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="ui-instance">
            Instance variable
          </LabelPrimitive>
          <Input
            id="ui-instance"
            value={instanceName}
            onChange={(event) => setInstanceName(event.target.value)}
            placeholder="CustomFrame"
          />
          <p className="text-xs text-muted-foreground">
            Provide the variable name of your GUI instance.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="ui-height">Height (px)</LabelPrimitive>
          <Input
            id="ui-height"
            type="number"
            value={height}
            onChange={(event) => {
              const parsed = Number(event.target.value);
              setHeight(
                Number.isFinite(parsed) ? Math.max(parsed, 0) : DEFAULT_HEIGHT
              );
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="ui-visible">Visible</LabelPrimitive>
          <div className="flex items-center gap-2">
            <Switch
              id="ui-visible"
              checked={visible}
              onCheckedChange={setVisible}
            />
            <span className="text-sm text-muted-foreground">
              Control whether the passthrough frame is displayed.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

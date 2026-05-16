"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Input } from "@/components/ui/input";
import { Label as LabelPrimitive } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { CopyPseudoComponent } from "./shared/CopyComponent";

const TARGET = [0, -0.4, 0] as const;
const DEFAULT_ORBIT = {
  azimuth: Math.PI / 4,
  elevation: Math.PI / 4,
  distance: 6,
};

function DemoPart() {
  return (
    <mesh position={[0, -0.5, 0]}>
      <boxGeometry args={[4, 1, 2]} />
      <meshStandardMaterial color="#d7dae1" />
    </mesh>
  );
}

function ViewportControls({
  interactive,
  focusSignal,
}: {
  interactive: boolean;
  focusSignal: number;
}) {
  const { camera, gl } = useThree();
  const orbit = useRef({ ...DEFAULT_ORBIT });
  const dragState = useRef<{
    dragging: boolean;
    lastX: number;
    lastY: number;
  } | null>(null);

  useEffect(() => {
    orbit.current = { ...DEFAULT_ORBIT };
  }, [focusSignal]);

  useEffect(() => {
    if (!interactive) return;
    const element = gl.domElement;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.button !== 2) return;
      dragState.current = {
        dragging: true,
        lastX: event.clientX,
        lastY: event.clientY,
      };
      element.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      const state = dragState.current;
      if (!state) return;
      const deltaX = event.clientX - state.lastX;
      const deltaY = event.clientY - state.lastY;
      state.lastX = event.clientX;
      state.lastY = event.clientY;

      orbit.current.azimuth -= deltaX * 0.005;
      orbit.current.elevation += deltaY * 0.005;
      orbit.current.elevation = Math.min(
        Math.max(0.1, orbit.current.elevation),
        Math.PI / 2 - 0.1
      );
    };

    const onPointerUp = (event: PointerEvent) => {
      element.releasePointerCapture(event.pointerId);
      dragState.current = null;
    };

    const onWheel = (event: WheelEvent) => {
      orbit.current.distance += event.deltaY * 0.01;
      orbit.current.distance = Math.min(
        Math.max(3, orbit.current.distance),
        12
      );
    };

    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointercancel", onPointerUp);
    element.addEventListener("wheel", onWheel);

    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerUp);
      element.removeEventListener("wheel", onWheel);
    };
  }, [gl, interactive]);

  useFrame(() => {
    const { azimuth, elevation, distance } = orbit.current;
    const x = distance * Math.cos(elevation) * Math.sin(azimuth);
    const y = distance * Math.sin(elevation);
    const z = distance * Math.cos(elevation) * Math.cos(azimuth);
    camera.position.set(TARGET[0] + x, TARGET[1] + y, TARGET[2] + z);
    camera.lookAt(TARGET[0], TARGET[1], TARGET[2]);
  });

  return null;
}

export default function ViewportPlayground() {
  const [interactive, setInteractive] = useState(true);
  const [autoFocus, setAutoFocus] = useState(true);
  const [height, setHeight] = useState(200);
  const [focusTick, setFocusTick] = useState(0);

  const pseudoCode = useMemo(() => {
    const lines = [
      `    Object = Instance.new("Part"),`,
      `    Camera = Instance.new("Camera"),`,
    ];

    lines.push(`    Interactive = ${interactive},`);
    lines.push(`    AutoFocus = ${autoFocus},`);

    if (height !== 200) {
      lines.push(`    Height = ${height},`);
    }

    return [
      'local Viewport = Groupbox:AddViewport("MyViewport", {',
      ...lines,
      "})",
    ].join("\n");
  }, [autoFocus, height, interactive]);

  const safeGeneratePseudoCode = () => pseudoCode;

  return (
    <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[360px] relative">
      <CopyPseudoComponent codegenfunc={safeGeneratePseudoCode} />

      <div className="flex items-center justify-center min-h-[200px] relative w-full mb-5">
        <div
          className={
            "w-full rounded-[1px] bg-[rgb(25,25,25)] border-[rgb(40,40,40)] border flex items-center justify-center max-w-[200px]"
          }
          style={{ height: `${height}px` }}
        >
          <Canvas
            key={focusTick}
            camera={{ position: [3.5, 3.5, 3.5], fov: 70 }}
            style={{ height, cursor: interactive ? "grab" : "default" }}
          >
            <hemisphereLight
              intensity={0.65}
              color="#e6ecff"
              groundColor="#1b212e"
            />
            <directionalLight position={[6, 8, 6]} intensity={1.15} />
            <Suspense fallback={null}>
              <DemoPart />
            </Suspense>
            <ViewportControls
              interactive={interactive}
              focusSignal={focusTick + (autoFocus ? 1 : 0)}
            />
          </Canvas>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="viewport-height">Height (px)</LabelPrimitive>
          <Input
            id="viewport-height"
            type="number"
            value={height}
            onChange={(event) => {
              const parsed = Number(event.target.value);
              setHeight(Number.isFinite(parsed) ? Math.max(parsed, 120) : 200);
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="viewport-interactive">
            Interactive
          </LabelPrimitive>
          <div className="flex items-center gap-2">
            <Switch
              id="viewport-interactive"
              checked={interactive}
              onCheckedChange={setInteractive}
            />
            <span className="text-sm text-muted-foreground">
              Allow orbit + zoom controls
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <LabelPrimitive htmlFor="viewport-autofocus">
            Auto focus
          </LabelPrimitive>
          <div className="flex items-center gap-2">
            <Switch
              id="viewport-autofocus"
              checked={autoFocus}
              onCheckedChange={setAutoFocus}
            />
            <span className="text-sm text-muted-foreground">
              Focus on object automatically
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <LabelPrimitive>Manual focus</LabelPrimitive>
          <Button onClick={() => setFocusTick((tick) => tick + 1)}>
            Focus viewport
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { useCornerRadius } from "../providers/ObsidianDataProvider";

const TARGET = [0, -0.4, 0] as const;
const DEFAULT_ORBIT = {
	azimuth: Math.PI / 4,
	elevation: Math.PI / 4,
	distance: 6
};

function DemoPart() {
	return (
		<mesh position={[0, -0.5, 0]}>
			<boxGeometry args={[4, 1, 2]} />
			<meshStandardMaterial color="#d7dae1" />
		</mesh>
	);
}

function ViewportControls({ interactive, focusSignal }: { interactive: boolean; focusSignal: number }) {
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
				lastY: event.clientY
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
			orbit.current.elevation = Math.min(Math.max(0.1, orbit.current.elevation), Math.PI / 2 - 0.1);
		};

		const onPointerUp = (event: PointerEvent) => {
			if (element.hasPointerCapture(event.pointerId)) {
				element.releasePointerCapture(event.pointerId);
			}
			dragState.current = null;
		};

		const onWheel = (event: WheelEvent) => {
			event.preventDefault();
			orbit.current.distance += event.deltaY * 0.01;
			orbit.current.distance = Math.min(Math.max(3, orbit.current.distance), 12);
		};

		element.addEventListener("pointerdown", onPointerDown);
		element.addEventListener("pointermove", onPointerMove);
		element.addEventListener("pointerup", onPointerUp);
		element.addEventListener("pointercancel", onPointerUp);
		element.addEventListener("wheel", onWheel, { passive: false });

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

export default function ObsidianViewport({
	height = 200,
	interactive = false,
	autoFocus = true
}: {
	height?: number;
	interactive?: boolean;
	autoFocus?: boolean;
}) {
	const br = useCornerRadius();
	const focusSignal = autoFocus ? height : -height;

	return (
		<div
			className="w-full overflow-hidden border border-[rgb(40,40,40)] bg-[rgb(25,25,25)]"
			style={{ height: `${height}px`, borderRadius: br }}
		>
			<Canvas
				camera={{ position: [3.5, 3.5, 3.5], fov: 70 }}
				style={{
					height,
					width: "100%",
					cursor: interactive ? "grab" : "default"
				}}
			>
				<hemisphereLight intensity={0.65} color="#e6ecff" groundColor="#1b212e" />
				<directionalLight position={[6, 8, 6]} intensity={1.15} />
				<Suspense fallback={null}>
					<DemoPart />
				</Suspense>
				<ViewportControls interactive={interactive} focusSignal={focusSignal} />
			</Canvas>
		</div>
	);
}

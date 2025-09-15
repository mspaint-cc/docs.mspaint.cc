"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { createPortal } from "react-dom";
import { Color3 } from "../../element.types";
import { useUIState } from "../../UIStateProvider";
import Input from "../Input";
import Label from "../Label";

// color conversion utils //
const colorUtils = {
  toHex: (value: number): string => {
    const clampedValue = Math.max(0, Math.min(255, Math.round(value)));
    return clampedValue.toString(16).padStart(2, "0");
  },

  rgbToHex: (color: Color3): string => {
    const { r, g, b } = color;
    return `#${colorUtils.toHex(r)}${colorUtils.toHex(g)}${colorUtils.toHex(
      b
    )}`;
  },

  rgbToString: (color: Color3): string => {
    return `${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(
      color.b
    )}`;
  },

  hexToRgb: (hex: string): Color3 | null => {
    const match = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim());
    if (!match) return null;

    const value = parseInt(match[1], 16);
    return {
      r: (value >> 16) & 0xff,
      g: (value >> 8) & 0xff,
      b: value & 0xff,
    };
  },

  stringToRgb: (rgbString: string): Color3 | null => {
    const match = /^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/.exec(
      rgbString.trim()
    );
    if (!match) return null;

    return {
      r: Math.max(0, Math.min(255, parseInt(match[1], 10))),
      g: Math.max(0, Math.min(255, parseInt(match[2], 10))),
      b: Math.max(0, Math.min(255, parseInt(match[3], 10))),
    };
  },

  rgbToHsv: (color: Color3) => {
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
      if (max === r) {
        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
      } else if (max === g) {
        h = ((b - r) / delta + 2) / 6;
      } else {
        h = ((r - g) / delta + 4) / 6;
      }
    }

    return {
      h: Math.round(h * 360),
      s: max === 0 ? 0 : delta / max,
      v: max,
    };
  },

  hsvToRgb: (h: number, s: number, v: number): Color3 => {
    const normalizedHue = ((h % 360) + 360) % 360;
    const c = v * s;
    const x = c * (1 - Math.abs(((normalizedHue / 60) % 2) - 1));
    const m = v - c;

    let r = 0,
      g = 0,
      b = 0;

    if (normalizedHue < 60) {
      [r, g, b] = [c, x, 0];
    } else if (normalizedHue < 120) {
      [r, g, b] = [x, c, 0];
    } else if (normalizedHue < 180) {
      [r, g, b] = [0, c, x];
    } else if (normalizedHue < 240) {
      [r, g, b] = [0, x, c];
    } else if (normalizedHue < 300) {
      [r, g, b] = [x, 0, c];
    } else {
      [r, g, b] = [c, 0, x];
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  },
};

const useColorState = (defaultValue: Color3 | null, stateKey?: string) => {
  const { state, setState } = useUIState();

  const storedColor = React.useMemo(
    () => (stateKey ? (state[stateKey] as Color3 | undefined) : undefined),
    [stateKey, state]
  );

  const initialColor = storedColor ||
    defaultValue || { r: 255, g: 255, b: 255 };
  const [color, setColor] = React.useState<Color3>(initialColor);
  const [hsv, setHsv] = React.useState(() => colorUtils.rgbToHsv(initialColor));

  // Keep refs to current values for drag operations //
  const colorRef = React.useRef(color);
  const hsvRef = React.useRef(hsv);

  React.useEffect(() => {
    colorRef.current = color;
    hsvRef.current = hsv;
  }, [color, hsv]);

  const updateFromRgb = React.useCallback(
    (newColor: Color3, updateUIState = true) => {
      setColor(newColor);
      setHsv((prevHsv) => {
        const newHsv = colorUtils.rgbToHsv(newColor);
        return newHsv.s === 0 ? { ...newHsv, h: prevHsv.h } : newHsv;
      });

      if (stateKey && updateUIState) {
        setState(stateKey, newColor);
      }
    },
    [stateKey, setState]
  );

  const updateFromHsv = React.useCallback(
    (newHsv: { h: number; s: number; v: number }, updateUIState = true) => {
      setHsv(newHsv);
      const newColor = colorUtils.hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
      setColor(newColor);

      if (stateKey && updateUIState) {
        setState(stateKey, newColor);
      }
    },
    [stateKey, setState]
  );

  const saveCurrentColor = React.useCallback(() => {
    if (stateKey) {
      setState(stateKey, colorRef.current);
    }
  }, [stateKey, setState]);

  // Sync with stored state - only update if external state changed //
  React.useEffect(() => {
    if (stateKey && storedColor) {
      const isDifferent =
        storedColor.r !== color.r ||
        storedColor.g !== color.g ||
        storedColor.b !== color.b;
      if (isDifferent) {
        setColor(storedColor);
        setHsv(colorUtils.rgbToHsv(storedColor));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateKey, storedColor]); // dont add color here, it will create an inf loop //

  return {
    color,
    hsv,
    updateFromRgb,
    updateFromHsv,
    saveCurrentColor,
    hexString: colorUtils.rgbToHex(color),
    rgbString: colorUtils.rgbToString(color),
  };
};

const usePopover = () => {
  const { state, setState } = useUIState();
  const localId = React.useId();
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ left: 0, top: 0 });

  const openId = state["colorPicker:openPopover"] as string | undefined;
  const isActive = isOpen && openId === localId;

  const open = React.useCallback(() => {
    setIsOpen(true);
    setState("colorPicker:openPopover", localId);
  }, [localId, setState]);

  const close = React.useCallback(() => {
    setIsOpen(false);
    if (openId === localId) {
      setState("colorPicker:openPopover", "");
    }
  }, [localId, openId, setState]);

  const toggle = React.useCallback(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);

  return {
    isActive,
    position,
    setPosition,
    open,
    close,
    toggle,
  };
};

const usePositioning = (
  anchorRef: React.RefObject<HTMLButtonElement | null>,
  isActive: boolean,
  setPosition: (pos: { left: number; top: number }) => void
) => {
  const GAP = 4;
  const PADDING = 8;

  const updatePosition = React.useCallback(() => {
    if (!anchorRef.current) return;

    const rect = anchorRef.current.getBoundingClientRect();
    let left = Math.round(rect.left + window.scrollX);
    let top = Math.round(rect.bottom + window.scrollY + GAP);

    // Keep within viewport bounds //
    left = Math.max(
      PADDING,
      Math.min(left, window.scrollX + window.innerWidth - PADDING)
    );
    top = Math.max(
      PADDING,
      Math.min(top, window.scrollY + window.innerHeight - PADDING)
    );

    setPosition({ left, top });
  }, [anchorRef, setPosition]);

  React.useEffect(() => {
    if (!isActive) return;

    const events = ["resize", "scroll"];
    events.forEach((event) =>
      window.addEventListener(event, updatePosition, true)
    );

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, updatePosition, true)
      );
    };
  }, [isActive, updatePosition]);

  return updatePosition;
};

const useDragHandler = () => {
  const createDragHandler = React.useCallback(
    (onMove: (x: number, y: number) => void, onEnd?: () => void) =>
      (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();

        const handleMove = (ev: MouseEvent | TouchEvent) => {
          const clientX =
            ev instanceof TouchEvent ? ev.touches[0]?.clientX : ev.clientX;
          const clientY =
            ev instanceof TouchEvent ? ev.touches[0]?.clientY : ev.clientY;
          if (clientX !== undefined && clientY !== undefined)
            onMove(clientX, clientY);
        };

        const handleEnd = () => {
          document.removeEventListener("mousemove", handleMove);
          document.removeEventListener("mouseup", handleEnd);
          document.removeEventListener("touchmove", handleMove);
          document.removeEventListener("touchend", handleEnd);
          onEnd?.();
        };

        document.addEventListener("mousemove", handleMove);
        document.addEventListener("mouseup", handleEnd);
        document.addEventListener("touchmove", handleMove, { passive: false });
        document.addEventListener("touchend", handleEnd, { passive: true });

        // Initial move //
        const initialX =
          e instanceof TouchEvent
            ? e.changedTouches[0]?.clientX
            : (e.nativeEvent as MouseEvent).clientX;
        const initialY =
          e instanceof TouchEvent
            ? e.changedTouches[0]?.clientY
            : (e.nativeEvent as MouseEvent).clientY;
        if (initialX !== undefined && initialY !== undefined)
          onMove(initialX, initialY);
      },
    []
  );

  return createDragHandler;
};

export default function ColorPicker({
  title,
  defaultValue,
  className,
  stateKey,
}: {
  title: string | null;
  defaultValue: Color3 | null;
  className?: string;
  stateKey?: string;
}) {
  // references //
  const rootRef = React.useRef<HTMLDivElement>(null);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const svRef = React.useRef<HTMLDivElement>(null);
  const hueRef = React.useRef<HTMLDivElement>(null);

  // state hooks //
  const {
    hsv,
    updateFromRgb,
    updateFromHsv,
    saveCurrentColor,
    hexString,
    rgbString,
  } = useColorState(defaultValue, stateKey);
  const { isActive, position, setPosition, close, toggle } = usePopover();
  const updatePosition = usePositioning(anchorRef, isActive, setPosition);
  const createDragHandler = useDragHandler();

  // input handlers //
  const handleHexInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = colorUtils.hexToRgb(e.target.value);
      if (newColor) updateFromRgb(newColor);
    },
    [updateFromRgb]
  );

  const handleRgbInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = colorUtils.stringToRgb(e.target.value);
      if (newColor) updateFromRgb(newColor);
    },
    [updateFromRgb]
  );

  // drag handlers //
  const handleSvDrag = React.useCallback(
    (clientX: number, clientY: number) => {
      if (!svRef.current) return;

      const rect = svRef.current.getBoundingClientRect();
      const s = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const v = Math.max(
        0,
        Math.min(1, 1 - (clientY - rect.top) / rect.height)
      );

      updateFromHsv({ h: hsv.h, s, v }, false); // don't update UI state during drag //
    },
    [hsv.h, updateFromHsv]
  );

  const handleHueDrag = React.useCallback(
    (clientX: number, clientY: number) => {
      if (!hueRef.current) return;

      const rect = hueRef.current.getBoundingClientRect();
      const normalizedY = Math.max(
        0,
        Math.min(1, (clientY - rect.top) / rect.height)
      );
      const h = (1 - normalizedY) * 360;

      updateFromHsv({ h, s: hsv.s, v: hsv.v }, false);
    },
    [hsv.s, hsv.v, updateFromHsv]
  );

  const handleDragEnd = React.useCallback(() => {
    saveCurrentColor();
  }, [saveCurrentColor]);

  // outside click closing //
  React.useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isActive, close]);

  // position update on open //
  React.useEffect(() => {
    if (isActive) {
      setTimeout(updatePosition, 0);
    }
  }, [isActive, updatePosition]);

  // drag handlers //
  const svDragHandler = createDragHandler(handleSvDrag, handleDragEnd);
  const hueDragHandler = createDragHandler(handleHueDrag, handleDragEnd);

  return (
    <div ref={rootRef} className="relative pointer-events-auto">
      <button
        type="button"
        ref={anchorRef}
        className={cn(
          "relative flex justify-center items-center w-[24px] h-[22px] border border-[rgb(40,40,40)] cursor-pointer",
          className
        )}
        style={{ backgroundColor: `rgb(${rgbString})` }}
        aria-label="Open color picker"
        aria-haspopup="dialog"
        aria-expanded={isActive}
        onClick={(e) => {
          e.preventDefault();
          toggle();
        }}
      />

      {isActive &&
        typeof window !== "undefined" &&
        createPortal(
          <div onMouseDown={close}>
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="false"
              className="absolute w-[240px] p-[6px] pt-[2px] bg-[rgb(15,15,15)] border border-[rgb(40,40,40)] origin-top-left scale-[0.8] max-sm:scale-[0.5] md:scale-90 lg:scale-100"
              style={{
                left: position.left,
                top: position.top,
                height: title ? "243px" : "223px",
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {title && <Label>{title}</Label>}

              <div
                className="mt-1 mb-1 h-[180px] flex items-stretch gap-1 select-none"
                onMouseDown={(e) => e.stopPropagation()}
              >
                {/* Saturation/Value Panel */}
                <div
                  ref={svRef}
                  className="relative w-[240px] border border-[rgb(50,50,50)] cursor-crosshair"
                  style={{
                    background: `
                    linear-gradient(to top, black, rgba(0,0,0,0)), 
                    linear-gradient(to right, white, hsl(${hsv.h}, 100%, 50%))
                  `,
                  }}
                  onMouseDown={svDragHandler}
                  onTouchStart={svDragHandler}
                >
                  <div
                    className="absolute w-[6px] h-[7px] border border-black rounded-full bg-white box-content pointer-events-none"
                    style={{
                      left: `${hsv.s * 100}%`,
                      top: `${(1 - hsv.v) * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>

                {/* Hue Slider */}
                <div
                  ref={hueRef}
                  className="relative w-[16px] border border-[rgb(50,50,50)] cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(to top, red, yellow, lime, cyan, blue, magenta, red)",
                  }}
                  onMouseDown={hueDragHandler}
                  onTouchStart={hueDragHandler}
                >
                  <div
                    className="absolute left-[-3px] w-[18px] h-[3px] border border-black bg-white pointer-events-none"
                    style={{
                      top: `${(1 - hsv.h / 360) * 100}%`,
                      transform: "translateY(-50%)",
                    }}
                  />
                </div>
              </div>

              {/* Input Fields */}
              <div
                className="flex flex-row gap-[7px] h-[26px]"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Input
                  inputClassName="text-center text-[12px]"
                  text=""
                  value={hexString}
                  placeholder="#rrggbb"
                  onChanged={handleHexInput}
                />
                <Input
                  inputClassName="text-center text-[12px]"
                  text=""
                  value={rgbString}
                  placeholder="r, g, b"
                  onChanged={handleRgbInput}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

"use client";

import DropdownElement from "@/components/obsidian/elements/Dropdown";
import { Input } from "@/components/ui/input";
import { Label as LabelPrimitive } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { useMemo, useState } from "react";
import { CopyPseudoComponent } from "./shared/CopyComponent";
import { UIStateProvider } from "@/components/obsidian/UIStateProvider";

function splitList(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function escapeLuaString(input: string) {
  return input
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/"/g, '\\"');
}

function formatLuaArray(values: string[]) {
  if (values.length === 0) return "";
  return values.map((value) => `"${escapeLuaString(value)}"`).join(", ");
}

export default function DropdownPlayground() {
  const [text, setText] = useState("A dropdown");
  const [valuesInput, setValuesInput] = useState("This, is, a, dropdown");
  const [defaultValueInput, setDefaultValueInput] = useState("This");
  const [disabledValuesInput, setDisabledValuesInput] = useState("");
  const [multi, setMulti] = useState(false);
  const [allowNull, setAllowNull] = useState(false);
  const [searchable, setSearchable] = useState(false);
  const [maxVisibleEnabled, setMaxVisibleEnabled] = useState(false);
  const [maxVisibleItems, setMaxVisibleItems] = useState(8);
  const [specialType, setSpecialType] = useState<"none" | "Player" | "Team">(
    "none"
  );
  const [excludeLocalPlayer, setExcludeLocalPlayer] = useState(true);

  const values = useMemo(() => splitList(valuesInput), [valuesInput]);

  const disabledValues = useMemo(
    () => splitList(disabledValuesInput).filter((value) => value.length > 0),
    [disabledValuesInput]
  );

  const { dropdownValue, luaDefault } = useMemo(() => {
    const trimmed = defaultValueInput.trim();
    const resolvedValues = values;

    if (multi) {
      const entries = splitList(defaultValueInput).filter((entry) =>
        resolvedValues.includes(entry)
      );
      const uniqueEntries = Array.from(new Set(entries));

      if (uniqueEntries.length === 0) {
        if (allowNull) {
          return {
            dropdownValue: {},
            luaDefault: "nil",
          };
        }

        const fallback = resolvedValues[0];
        if (!fallback) {
          return {
            dropdownValue: {},
            luaDefault: "nil",
          };
        }

        return {
          dropdownValue: { [fallback]: true },
          luaDefault: `"${escapeLuaString(fallback)}"`,
        };
      }

      if (uniqueEntries.length === 1) {
        const value = uniqueEntries[0];
        return {
          dropdownValue: { [value]: true },
          luaDefault: `"${escapeLuaString(value)}"`,
        };
      }

      const mapValue = uniqueEntries.reduce(
        (acc, entry) => ({ ...acc, [entry]: true }),
        {} as Record<string, boolean>
      );

      return {
        dropdownValue: mapValue,
        luaDefault: `{ ${formatLuaArray(uniqueEntries)} }`,
      };
    }

    if (/^\d+$/.test(trimmed)) {
      const index = Number(trimmed);
      if (index >= 1 && index <= resolvedValues.length) {
        return {
          dropdownValue: resolvedValues[index - 1] ?? "",
          luaDefault: String(index),
        };
      }
    }

    const matchedValue = trimmed.length
      ? resolvedValues.find((value) => value === trimmed)
      : undefined;

    if (matchedValue) {
      return {
        dropdownValue: matchedValue,
        luaDefault: `"${escapeLuaString(matchedValue)}"`,
      };
    }

    if (allowNull || resolvedValues.length === 0) {
      return {
        dropdownValue: "",
        luaDefault: "nil",
      };
    }

    const fallback = resolvedValues[0];
    return {
      dropdownValue: fallback,
      luaDefault: `"${escapeLuaString(fallback)}"`,
    };
  }, [allowNull, defaultValueInput, multi, values]);

  const memoizedDropdown = useMemo(
    () => (
      <UIStateProvider>
        <DropdownElement
          text={text}
          value={dropdownValue}
          options={values}
          multi={multi}
          disabledValues={disabledValues}
        />
      </UIStateProvider>
    ),
    [disabledValues, dropdownValue, multi, text, values]
  );

  function generatePseudoCode() {
    const lines = [
      `    Values = { ${formatLuaArray(values)} },`,
      `    Default = ${luaDefault},`,
      `    Multi = ${multi ? "true" : "false"},`,
      `    Text = "${escapeLuaString(text)}",`,
    ];

    if (allowNull) {
      lines.push(`    AllowNull = true,`);
    }

    if (searchable) {
      lines.push(`    Searchable = true,`);
    }

    if (maxVisibleEnabled) {
      lines.push(`    MaxVisibleDropdownItems = ${maxVisibleItems},`);
    }

    if (disabledValues.length > 0) {
      lines.push(`    DisabledValues = { ${formatLuaArray(disabledValues)} },`);
    }

    if (specialType !== "none") {
      lines.push(`    SpecialType = "${specialType}",`);
      if (specialType === "Player" && excludeLocalPlayer) {
        lines.push(`    ExcludeLocalPlayer = true,`);
      }
    }

    return ['Groupbox:AddDropdown("MyDropdown", {', ...lines, "})"].join("\n");
  }

  const safeGeneratePseudoCode = () => {
    const result = generatePseudoCode();
    return typeof result === "string" ? result : "";
  };

  return (
    <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[340px] relative">
      <CopyPseudoComponent codegenfunc={safeGeneratePseudoCode} />

      <div className="flex items-center justify-center min-h-[150px] relative w-full">
        <div className="w-full max-w-xl">{memoizedDropdown}</div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="dropdown-text">Label text</LabelPrimitive>
            <Input
              id="dropdown-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="dropdown-values">
              Values (comma separated)
            </LabelPrimitive>
            <Input
              id="dropdown-values"
              value={valuesInput}
              onChange={(event) => setValuesInput(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="dropdown-default">
              Default value or index
            </LabelPrimitive>
            <Input
              id="dropdown-default"
              value={defaultValueInput}
              onChange={(event) => setDefaultValueInput(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="dropdown-disabled">
              Disabled values (comma separated)
            </LabelPrimitive>
            <Input
              id="dropdown-disabled"
              value={disabledValuesInput}
              onChange={(event) => setDisabledValuesInput(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="dropdown-max-toggle">
              Limit visible items
            </LabelPrimitive>
            <div className="flex items-center gap-2">
              <Switch
                id="dropdown-max-toggle"
                checked={maxVisibleEnabled}
                onCheckedChange={(checked) => {
                  setMaxVisibleEnabled(checked);
                  if (!checked) setMaxVisibleItems(8);
                }}
              />
              <span className="text-sm text-muted-foreground">
                Control dropdown height
              </span>
            </div>
            {maxVisibleEnabled ? (
              <Input
                id="dropdown-max-items"
                type="number"
                value={maxVisibleItems}
                onChange={(event) => {
                  const parsed = Number(event.target.value);
                  setMaxVisibleItems(Number.isFinite(parsed) ? parsed : 8);
                }}
              />
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="dropdown-special-type">
              Special type
            </LabelPrimitive>
            <select
              id="dropdown-special-type"
              value={specialType}
              onChange={(event) =>
                setSpecialType(event.target.value as "none" | "Player" | "Team")
              }
              className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground"
            >
              <option value="none">None</option>
              <option value="Player">Player</option>
              <option value="Team">Team</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="dropdown-multi">
              Multi select
            </LabelPrimitive>
            <div className="flex items-center gap-2">
              <Switch
                id="dropdown-multi"
                checked={multi}
                onCheckedChange={setMulti}
              />
              <span className="text-sm text-muted-foreground">
                Allow selecting multiple values
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="dropdown-allow-null">
              Allow empty selection
            </LabelPrimitive>
            <div className="flex items-center gap-2">
              <Switch
                id="dropdown-allow-null"
                checked={allowNull}
                onCheckedChange={setAllowNull}
              />
              <span className="text-sm text-muted-foreground">
                Permit clearing the selection
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <LabelPrimitive htmlFor="dropdown-searchable">
              Searchable
            </LabelPrimitive>
            <div className="flex items-center gap-2">
              <Switch
                id="dropdown-searchable"
                checked={searchable}
                onCheckedChange={setSearchable}
              />
              <span className="text-sm text-muted-foreground">
                Enable searching through values
              </span>
            </div>
          </div>

          {specialType === "Player" ? (
            <div className="flex flex-col gap-2">
              <LabelPrimitive htmlFor="dropdown-exclude-player">
                Exclude local player
              </LabelPrimitive>
              <div className="flex items-center gap-2">
                <Switch
                  id="dropdown-exclude-player"
                  checked={excludeLocalPlayer}
                  onCheckedChange={setExcludeLocalPlayer}
                />
                <span className="text-sm text-muted-foreground">
                  Remove the local player from the list
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

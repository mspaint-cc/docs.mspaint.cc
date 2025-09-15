import Image from "next/image";
import { MoveDiagonal2, Move, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import React, { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { TabParser } from "./DynamicTab";
import { UIData } from "./element.types";
import { IBMMono } from "./fonts";

import * as LucideIcons from "lucide-react";
type LucideIcon = React.ComponentType<React.ComponentProps<"svg">>;
const normalizeIconName = (name?: string) => {
  if (!name) return name;
  return name.endsWith("Icon") ? name.slice(0, -4) : name;
};
const getIcon = (name?: string) => {
  const key = normalizeIconName(name);
  return (
    (key && (LucideIcons as unknown as Record<string, LucideIcon>)[key]) || null
  );
};

interface ObsidianWindowProps {
  title: ReactNode | string;
  icon?: ReactNode | string;
  footer: ReactNode | string;
  uiData?: UIData;
  width?: number | string;
  height?: number | string;
}

export function ObsidianWindow({
  title,
  icon,
  footer,
  uiData,
  width,
  height,
}: ObsidianWindowProps) {
  const sortedTabs = React.useMemo(
    () =>
      uiData
        ? Object.entries(uiData.tabs).sort(([, a], [, b]) => a.order - b.order)
        : [],
    [uiData]
  );
  const defaultTab = sortedTabs[0]?.[0] || "Home";

  if (!uiData) return <p>Loading Features...</p>;
  const w = typeof width === "number" ? `${width}px` : width ?? "720px";
  const h = typeof height === "number" ? `${height}px` : height ?? "600px";
  return (
    <div
      className={cn(
        "rounded-[3px] bg-[rgb(15,15,15)] border-[rgb(40,40,40)] border relative font-normal stroke-white text-white",
        IBMMono.className
      )}
      style={{ width: w, height: h }}
    >
      <div className="w-full h-[48px] flex flex-row px-0 bg-[rbga(13,13,13,1)]">
        {/* Title */}
        <div className="flex flex-row items-center justify-center w-[30%] h-full gap-[3px] border-b-[rgb(40,40,40)] border-b">
          {typeof icon === "string" ? (
            <Image src={icon} width={30} height={30} alt="logo" />
          ) : (
            icon ?? null
          )}
          <span className="text-white text-sm ml-1">{title}</span>
        </div>

        <div className="w-[70%] h-full flex flex-row items-center gap-[3px] border-l-[rgb(40,40,40)] border-l border-b-[rgb(40,40,40)] border-b">
          <div className="absolute mt-0 left-[214px] w-[505px] h-[49px] flex items-center">
            {/* Searchbox */}
            <div className="flex items-center w-[449px] h-[34px] ml-[8px] mt-[1px] bg-[#191919] border border-[#272727] rounded px-2">
              <Search className="text-[#5f5f5f] mr-2" />
              <input
                type="text"
                placeholder="Search"
                aria-label="Search"
                className="w-full mt-[4px] text-center text-[13.5px] text-[#fff] bg-transparent placeholder-[#5f5f5f] outline-none"
              />
            </div>

            {/* Move Icon */}
            <Move className="text-[rgb(40,40,40)] ml-auto mr-auto" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue={defaultTab}
        className="h-[calc(100%-69px)] w-full flex flex-row bg-[#111111] gap-0"
      >
        <TabsList className="h-full border-r-[rgb(40,40,40)] border-r min-w-[calc(30%+1.2px)] flex flex-col justify-start bg-[rgba(15,15,15,1)] rounded-none p-0">
          {sortedTabs.map(([tabName, tab], index) => {
            const IconTab = getIcon(tab.icon);
            return (
              <TabsTrigger
                value={tabName}
                key={index}
                className="flex flex-row items-center justify-start w-full max-h-[40px] min-h-[40px] border-b-[rgb(40,40,40)] border-b rounded-none py-[11px] px-[12px] data-[state=active]:bg-[rgb(25,25,25)] text-white text-opacity-75 data-[state=active]:text-white"
              >
                {IconTab && (
                  <IconTab className="text-[rgb(125,85,255)] h-full mr-2" />
                )}
                <span className="text-[13px]">{tabName}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {sortedTabs.map(([tabName, tab], index) => (
          <TabsContent
            value={tabName}
            key={index}
            className="flex flex-col w-full max-w-[calc(100%-30%+1.2px)] bg-[#111111] p-0 mt-0 overflow-hidden"
          >
            <TabParser tabData={tab} />
          </TabsContent>
        ))}
      </Tabs>

      {/* Footer */}
      <div className="h-[20px] w-full bg-[rgb(15,15,15)] border-t-[rgb(40,40,40)] border-t absolute bottom-0 flex flex-row items-center justify-center">
        <p className="text-[12px] text-white opacity-50">{footer}</p>

        <MoveDiagonal2 className="text-white opacity-50 w-[16px] h-[16px] absolute right-0 mr-[2px] pointer-events-none" />
      </div>
    </div>
  );
}

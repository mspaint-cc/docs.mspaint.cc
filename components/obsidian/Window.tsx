import Image from "next/image";
import { MoveDiagonal2, Move, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/ObsidianRadixTabs";
import React, { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { TabParser } from "./ui/DynamicTab";
import { UIData } from "./element.types";
import { IBMMono } from "./fonts";
import { ObsidianDataProvider } from "./providers/ObsidianDataProvider";
import Label from "./elements/Label";

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
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  React.useEffect(() => {
    if (defaultTab && !activeTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, activeTab]);

  if (!uiData) return <p>Loading...</p>;

  const w = typeof width === "number" ? `${width}px` : width ?? "720px";
  const h = typeof height === "number" ? `${height}px` : height ?? "600px";

  const activeTabData = uiData.tabs[activeTab];
  const hasDescription = activeTabData && activeTabData.description;

  return (
    <ObsidianDataProvider cornerRadius={uiData.metadata?.cornerRadius} forceCheckbox={uiData.metadata?.forceCheckbox}>
      <div
        className={cn(
          "rounded-[3px] bg-[rgb(15,15,15)] border-[rgb(40,40,40)] border relative font-normal stroke-white text-white",
          IBMMono.className
        )}
        style={{ width: w, height: h }}
      >
        <div className="w-full h-[48px] flex flex-row px-0 bg-[#0d0d0d]">
          {/* Title */}
          <div className="flex flex-row items-center justify-center w-[30%] h-full gap-[3px] border-b-[rgb(40,40,40)] border-b">
            {typeof icon === "string" ? (
              <Image
                src={icon}
                width={30}
                height={30}
                alt="logo"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              icon ?? null
            )}
            <span className="text-white ml-1">{title}</span>
          </div>

          {/* Right Header Area */}
          <div className="w-[70%] h-full flex flex-row items-center border-l-[rgb(40,40,40)] border-l border-b-[rgb(40,40,40)] border-b px-2">
            <div className="flex-1 flex flex-row items-center h-full overflow-hidden">
              {/* Tab Info Section */}
              {hasDescription && (
                <div className="flex flex-col justify-center min-w-0 flex-1 h-full px-2">
                  <Label className="text-xs font-normal leading-tight truncate">
                    {activeTabData.name || "Tab"}
                  </Label>

                  <Label className="text-xs opacity-50 leading-snug w-[90%]">
                    {activeTabData.description}
                  </Label>
                </div>
              )}

              {/* Searchbox and Move Icon */}
              <div className={cn(
                "flex flex-row items-center gap-2 h-full",
                !hasDescription ? "flex-1" : ""
              )}>
                <div className={cn(
                  "relative flex items-center h-[34px] bg-[#191919] border border-[#272727] rounded px-2",
                  hasDescription ? "w-[200px]" : "w-full"
                )}>
                  <Search className="absolute left-2 text-[#5f5f5f] w-4 h-4 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search"
                    aria-label="Search"
                    className="w-full h-full text-center text-[13.5px] text-[#fff] bg-transparent placeholder-[#888] outline-none leading-none"
                  />
                </div>
                <Move className="text-[rgb(40,40,40)] w-6 h-6 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-[calc(100%-69px)] w-full flex flex-row bg-[#111111] gap-0"
        >
          <TabsList className="h-full border-r-[rgb(40,40,40)] border-r min-w-[30%] flex flex-col justify-start bg-[rgb(15,15,15)] rounded-none p-0 overflow-y-auto overflow-x-hidden">
            {sortedTabs.map(([tabName, tab], index) => {
              const IconTab = getIcon(tab.icon);
              return (
                <TabsTrigger
                  value={tabName}
                  key={index}
                  className="flex flex-row items-center justify-start w-full max-h-[40px] min-h-[40px] rounded-none py-[11px] px-[12px] data-[state=active]:bg-[rgb(25,25,25)] text-white text-opacity-75 data-[state=active]:text-white"
                >
                  {IconTab ? (
                    <IconTab className="text-[rgb(125,85,255)] h-full mr-2" />
                  ) : (
                    <LucideIcons.Ellipsis className="opacity-0 text-[rgb(125,85,255)] h-full mr-2" />
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
              className="flex flex-col w-full bg-[#111111] p-0 mt-0 overflow-hidden"
            >
              <TabParser tabData={tab} />
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer */}
        <div className="h-[20px] w-full bg-[rgb(20,20,20)] border-t-[rgb(40,40,40)] border-t absolute bottom-0 flex flex-row items-center justify-center">
          <p className="text-[12px] text-white opacity-50">{footer}</p>

          <MoveDiagonal2 className="text-white opacity-50 w-[16px] h-[16px] absolute right-0 mr-[2px] pointer-events-none" />
        </div>
      </div>
    </ObsidianDataProvider>
  );
}
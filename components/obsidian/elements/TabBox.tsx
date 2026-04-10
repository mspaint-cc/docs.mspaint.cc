"use client";

import { useState, useMemo, useEffect } from "react";
import { ElementParser } from "../ui/DynamicTab";
import { TabboxTab } from "../element.types";
import { useCornerRadius } from "../providers/ObsidianDataProvider";

export default function Tabbox({
  tabs,
  scope,
}: {
  tabs: { [key: string]: TabboxTab };
  scope: string;
}) {
  const tabNames = useMemo(
    () =>
      Object.keys(tabs).sort(
        (a, b) => (tabs[a]?.order ?? 0) - (tabs[b]?.order ?? 0)
      ),
    [tabs]
  );

  const [activeTab, setActiveTab] = useState(tabNames[0]);
  const activeTabData = useMemo(() => tabs[activeTab], [tabs, activeTab]);
  useEffect(() => {
    if (tabNames.length && (!activeTab || !tabs[activeTab])) {
      setActiveTab(tabNames[0]);
    }
  }, [tabNames, tabs, activeTab]);

  const br = useCornerRadius();

  if (tabNames.length === 0) return null;
  return (
    <div
      className="mt-1 ml-2 mb-3 bg-[rgb(15,15,15)] border border-[rgb(40,40,40)] relative font-normal"
      style={{ borderRadius: br }}
    >
      <div className="w-full h-[38px] flex flex-row bg-[rgb(15,15,15)]" style={{ borderRadius: br }}>
        {/* Buttons */}
        <div className="flex flex-row items-center w-full border-b border-b-[rgb(40,40,40)]">
          {tabNames &&
            tabNames.map((name, index) => (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`flex-1 h-full text-[13px] ${activeTab === name
                  ? "text-white"
                  : "bg-[rgb(40,40,40)] text-white opacity-50"
                  }`}
                style={{
                  borderTopLeftRadius: index === 0 ? br : undefined,
                  borderTopRightRadius: index === tabNames.length - 1 ? br : undefined,
                }}
              >
                {name}
              </button>
            ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col right p-[0.35rem] pb-2 gap-[0.35rem]">
        {activeTabData?.elements?.map((el) => (
          <ElementParser
            key={`${activeTab}-${el.index}`}
            element={el}
            stateKeyPrefix={`${scope}:tab:${activeTab}`}
          />
        ))}
      </div>
    </div>
  );
}

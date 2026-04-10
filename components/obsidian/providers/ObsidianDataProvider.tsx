"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface ObsidianDataContextType {
  cornerRadius: number;
  forceCheckbox: boolean;
}

const ObsidianDataContext = createContext<ObsidianDataContextType>({
  cornerRadius: 4,
  forceCheckbox: false,
});

export function ObsidianDataProvider({
  cornerRadius = 4,
  forceCheckbox = false,
  children,
}: {
  cornerRadius?: number;
  forceCheckbox?: boolean;
  children: ReactNode;
}) {
  return (
    <ObsidianDataContext.Provider value={{ cornerRadius, forceCheckbox }}>
      {children}
    </ObsidianDataContext.Provider>
  );
}

export function useCornerRadius() {
  const context = useContext(ObsidianDataContext);
  return `${context.cornerRadius}px`;
}

export function useForceCheckbox() {
  const context = useContext(ObsidianDataContext);
  return context.forceCheckbox;
}
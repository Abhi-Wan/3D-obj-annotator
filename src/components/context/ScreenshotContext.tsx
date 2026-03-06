import { createContext, useContext, useState } from "react";

type ScreenshotContextType = {
  screenshots: string[]
  addScreenshot: (url: string) => void;
}

export const ScreenshotContext = createContext<ScreenshotContextType | null>(null);

export function ScreenshotProvider({ children }: { children: React.ReactNode }) {
  const [screenshots, setScreenshots] = useState<string[]>([]);

  const addScreenshot = (url: string) => {
    setScreenshots(screenshots => [...screenshots, url]);
  }

  return (
    <ScreenshotContext value={{ screenshots, addScreenshot }}>
      {children}
    </ScreenshotContext>
  )
}

export function useScreenshots() {
  const context = useContext(ScreenshotContext);
  if (!context) throw new Error('No ScreenshotContext available');
  return context;
}
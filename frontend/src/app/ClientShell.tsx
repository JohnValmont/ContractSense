"use client";

import { useState, useCallback } from "react";
import SplashScreen from "./components/SplashScreen";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [splashDone, setSplashDone] = useState(false);
  const handleDone = useCallback(() => setSplashDone(true), []);

  return (
    <>
      {!splashDone && <SplashScreen onDone={handleDone} />}
      <div style={{ opacity: splashDone ? 1 : 0, transition: "opacity 0.5s ease" }}>
        {children}
      </div>
    </>
  );
}

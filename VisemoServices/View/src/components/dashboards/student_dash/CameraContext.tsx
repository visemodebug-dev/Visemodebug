import React, { createContext, useContext, useRef } from "react";

type CameraContextType = {
  streamRef: React.MutableRefObject<MediaStream | null>;
};

const CameraContext = createContext<CameraContextType | null>(null);

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const streamRef = useRef<MediaStream | null>(null);

  return (
    <CameraContext.Provider value={{ streamRef }}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => {
  const ctx = useContext(CameraContext);
  if (!ctx) throw new Error("useCamera must be used inside CameraProvider");
  return ctx;
};

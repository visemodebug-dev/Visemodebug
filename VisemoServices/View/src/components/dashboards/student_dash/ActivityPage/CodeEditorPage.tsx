import React from "react";
import Navbar from "../../Navbar";
import CodeEditor from "./CodeEditor";
import { useLocation } from "react-router-dom";
import { useCamera } from "../CameraContext";

const CodeEditorPage: React.FC = () => {
  const location = useLocation();
  const { activityId } = location.state || {};
  const { streamRef } = useCamera();

  if (!activityId) {
    return (
      <div className="text-center text-white p-8">
        ⚠️ No activity ID provided.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Content below navbar */}
      <div className="flex-1 bg-gray-900 text-white pt-16 overflow-hidden">
        <CodeEditor
          activityId={activityId}
          isCapturing={true}
          stream={streamRef.current}
          onSnapshot={(image) => console.log("Captured", image)}
          capturedImages={[]}
          onViewImages={() => {}}
        />
      </div>
    </div>
  );
};

export default CodeEditorPage;

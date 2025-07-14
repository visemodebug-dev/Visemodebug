import React from "react";
import Navbar from "../../Navbar";
import CodeEditor from "./CodeEditor";
import { useLocation } from "react-router-dom";
import { useCamera } from "../CameraContext";

const CodeEditorPage: React.FC = () => {
  const location = useLocation();
  const { activityId} = location.state || {};
  
  const { streamRef } = useCamera();

  if (!activityId) {
    return <div className="text-center text-white p-8">⚠️ No activity ID provided.</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Navbar user={{ name: "Carl Andre Interino", role: "Student" }} logoText="VISEMO" />

      <div className="flex-1">
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

import React, { useEffect, useRef, useState, useCallback } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { getActivityById, submitBuild, submitPicture, submitStudentCode } from "../../../../api/classroomApi";

interface CodeEditorProps {
  activityId?: number;
  classroomId?: number;
  isCapturing: boolean;
  stream: MediaStream | null;
  onSnapshot: (imageData: string) => void;
  capturedImages: Array<{ data: string; timestamp: string }>;
  onViewImages: () => void;
  runBuild?: "success" | "fail" | null;
  instruction?: string;
}

const DEFAULT_CODE = `using System;

public class Program
{
    public static void Main(string[] args)
    {
        Console.WriteLine("Hello, World!");
    }
}`;

const CodeEditor: React.FC<CodeEditorProps> = ({
  activityId,
  isCapturing,
  stream,
  onSnapshot,
  instruction: initialInstruction,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [timeUntilNextCapture, setTimeUntilNextCapture] = useState(30);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [instruction, setInstruction] = useState<string>(
    initialInstruction || "Loading instructions..."
  );
  const [videoReady, setVideoReady] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

const handleSubmitFinalCode = async () => {
  const userId = Number(localStorage.getItem("userId"));
  if (!userId || !activityId) {
    console.error("Missing userId or activityId");
    return;
  }

  const codeToSubmit = editorRef.current?.getValue();
  if (!codeToSubmit) {
    console.error("No code to submit");
    return;
  }

  try {
    await submitStudentCode({ userId, activityId, code: codeToSubmit });
    console.log("✅ Final code submitted to backend");
    setShowSubmitModal(false);
  } catch (err) {
    console.error("❌ Failed to submit code:", err);
  }
};


  useEffect(() => {
    if (!activityId) return;

    const fetchActivity = async () => {
      try {
        const activity = await getActivityById(Number(activityId));
        setInstruction(activity.instruction || "No instructions provided.");
      } catch (err) {
        console.error("Failed to fetch activity", err);
        setInstruction("Failed to load instructions.");
      }
    };

    fetchActivity();
  }, [activityId]);

  useEffect(() => {
    setVideoReady(false);
    if (!stream) return;

    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.srcObject = stream;

    const handleCanPlay = () => {
      setVideoReady(true);
    };

    videoEl.addEventListener("canplay", handleCanPlay);
    videoEl.play().catch((err) => console.error("Error playing video", err));

    return () => {
      videoEl.pause();
      videoEl.srcObject = null;
      videoEl.removeEventListener("canplay", handleCanPlay);
    };
  }, [stream]);

const takeAndSubmitSnapshot = useCallback(async () => {
  const video = videoRef.current;
  if (!video || video.readyState < video.HAVE_CURRENT_DATA) {
    console.log("⏳ Video not ready for snapshot.");
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(video, 0, 0);
  const imageData = canvas.toDataURL("image/jpeg", 0.8);
  onSnapshot(imageData);

  const userId = Number(localStorage.getItem("userId"));
  if (!userId || !activityId) {
    console.error("Missing userId or activityId for snapshot");
    return;
  }

  try {
    await submitPicture({
      image: imageData,
      userId,
      activityId,
    });
    console.log("✅ Image sent to DetectEmotion endpoint.");
  } catch (err) {
    console.error("❌ Failed to submit picture:", err);
  }
}, [onSnapshot, activityId]);

  useEffect(() => {
    let captureInterval: NodeJS.Timeout | null = null;
    let countdownInterval: NodeJS.Timeout | null = null;

    if (isCapturing && stream) {
      setTimeUntilNextCapture(30);

      captureInterval = setInterval(takeAndSubmitSnapshot, 30000);

      countdownInterval = setInterval(() => {
        setTimeUntilNextCapture((prev) => {
          if (prev <= 1) return 30;
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (captureInterval) clearInterval(captureInterval);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  },[isCapturing, stream, takeAndSubmitSnapshot, videoReady]);

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme("custom-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "FF69B4" },
        { token: "string", foreground: "D69D85" },
        { token: "identifier", foreground: "9CDCFE" },
        { token: "type", foreground: "569CD6" },
      ],
      colors: {
        "editor.background": "#1E1E1E",
        "editor.foreground": "#D4D4D4",
        "editor.lineHighlightBackground": "#1E1E1E",
        "editorLineNumber.foreground": "#6B7280",
        "editorLineNumber.activeForeground": "#6B7280",
      },
    });
  };

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.addAction({
      id: "run-code",
      label: "Run Code",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: handleRunCode,
    });
  };

  const handleRunCode = async () => {
    await takeAndSubmitSnapshot();

    setIsRunning(true);
    setError(null);
    setOutput("");
    let isSuccessful = false;

    try {
      const code = editorRef.current.getValue();

      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": "04bbcf18ecmsh2ef5d6c16bb95bdp180920jsn4bfff42108cb",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify({
          language_id: 51,
          source_code: btoa(code),
          stdin: "",
          base64_encoded: true,
        }),
      };

      const response = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
        options
      );
      const result = await response.json();

      if (result.status?.id >= 6) {
        isSuccessful = false;
        switch (result.status.id) {
          case 6:
            setError(atob(result.compile_output || "Compilation error"));
            break;
          case 7:
            setError("Time limit exceeded");
            break;
          case 8:
            setError("Memory limit exceeded");
            break;
          case 11:
            setError(atob(result.stderr || "Runtime error"));
            break;
          default:
            setError(result.status.description || "An error occurred");
        }
      } else if (result.stdout) {
        isSuccessful = true;
        setOutput(atob(result.stdout));
      } else {
        isSuccessful = false;
      }

      const userId = Number(localStorage.getItem("userId"));
      if (!userId || !activityId) {
        console.error("Missing userId or activityId");
      } else {
        await submitBuild({ userId, activityId, isSuccessful });
        console.log("✅ Build status submitted to backend");
      }
    } catch (err) {
      isSuccessful = false;
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white rounded-lg overflow-hidden">
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />

      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <span>Main.cs</span>
        <div className="flex items-center space-x-4">
          {isCapturing && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm">Recording</span>
              <span className="text-sm text-gray-400">
                Next capture in: {timeUntilNextCapture}s
              </span>
            </div>
          )}
         <button
    onClick={handleRunCode}
    disabled={isRunning}
    className={`px-4 py-2 rounded flex items-center space-x-2 ${
      isRunning
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-orange-500 hover:bg-orange-600"
    }`}
  >
    {isRunning ? "Running..." : "Run"}
  </button>

  <button
    onClick={() => setShowSubmitModal(true)}
    className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded"
  >
    Submit
  </button>
</div>

    {/* Confirmation Modal */}
    {showSubmitModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white text-black p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Are you sure you want to submit?</h3>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              No
            </button>
            <button
              onClick={handleSubmitFinalCode}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    )}
    </div>

      <div className="grid grid-cols-[2fr,1fr] h-[calc(100vh-64px)]">
        <div className="h-full border-r border-[#2d2d2d]">
          <Editor
            height="100%"
            defaultLanguage="csharp"
            theme="custom-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            beforeMount={handleEditorWillMount}
            onMount={handleEditorDidMount}
          />
        </div>

        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-[#2d2d2d]">
            <h2 className="text-white text-lg font-semibold mb-2">Instructions</h2>
            <p className="text-gray-300">{instruction}</p>
          </div>

          <div className="p-4">
            <h2 className="text-white text-lg font-semibold mb-2">Output</h2>
            <div className="bg-black rounded p-3 min-h-[100px] font-mono">
              {isRunning ? (
                <div className="text-yellow-400">Executing code...</div>
              ) : error ? (
                <div className="text-red-400 whitespace-pre-wrap">{error}</div>
              ) : output ? (
                <div className="text-green-400 whitespace-pre-wrap">{output}</div>
              ) : (
                <div className="text-gray-500">
                  Program output will appear here...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;

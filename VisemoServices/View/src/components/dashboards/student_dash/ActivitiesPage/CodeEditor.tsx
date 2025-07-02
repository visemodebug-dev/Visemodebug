import React, { useEffect, useRef, useState } from "react";
import Editor, {Monaco} from "@monaco-editor/react";


interface CodeEditorProps {
  activityId?: string;
  isCapturing: boolean;
  stream: MediaStream | null;
  onSnapshot: (imageData: string) => void;
  capturedImages: Array<{ data: string; timestamp: string; }>;
  onViewImages: () => void;
  runBuild?: 'success' | 'fail' | null;
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
  capturedImages,
  onViewImages,
  runBuild,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [timeUntilNextCapture, setTimeUntilNextCapture] = useState(30);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);

  // Set up video stream once
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => console.error('Error playing video:', err));
    }
  }, [stream]);

  // Capture logic
  useEffect(() => {
    let captureInterval: NodeJS.Timeout | null = null;
    let countdownInterval: NodeJS.Timeout | null = null;
  
    const takeSnapshot = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onSnapshot(imageData);
        console.log('Snapshot taken at:', new Date().toLocaleTimeString());
      }
    };
  
    if (isCapturing && stream) {
      setTimeUntilNextCapture(30);
  
      console.log('Starting capture interval');
      captureInterval = setInterval(takeSnapshot, 30000);
  
      console.log('Starting countdown interval');
      countdownInterval = setInterval(() => {
        setTimeUntilNextCapture((prev) => {
          if (prev <= 1) return 30;
          return prev - 1;
        });
      }, 1000);
    }
  
    return () => {
      console.log('Clearing intervals');
      if (captureInterval) clearInterval(captureInterval);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [isCapturing, stream, onSnapshot]); 

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'FF69B4' },
        { token: 'string', foreground: 'D69D85' },
        { token: 'identifier', foreground: '9CDCFE' },
        { token: 'type', foreground: '569CD6' },
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
        'editor.lineHighlightBackground': '#1E1E1E',
        'editorLineNumber.foreground': '#6B7280',
        'editorLineNumber.activeForeground': '#6B7280',
      }
    });
  };

  // Function to handle editor mounting
  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Add custom actions
    editor.addAction({
      id: 'run-code',
      label: 'Run Code',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter
      ],
      run: handleRunCode
    });
  };

   // Function to run code
   const handleRunCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput("");
    let buildStatus: 'success' | 'fail' | null = null;
  
    try {
      const code = editorRef.current.getValue();
  
      const options = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': '04bbcf18ecmsh2ef5d6c16bb95bdp180920jsn4bfff42108cb',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        body: JSON.stringify({
          language_id: 51, // C# (.NET Core SDK)
          source_code: btoa(code), // Base64 encode the source code
          stdin: '',
          base64_encoded: true // Indicate that we're using base64 encoding
        })
      };
  
      // Submit code
      const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true', options);
      const result = await response.json();
      
      console.log("API Response:", result);
  
      if (result.status?.id >= 6) {
        buildStatus = 'fail';
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
        buildStatus = 'success';
        setOutput(atob(result.stdout));
      } else if (result.stderr) {
        buildStatus = 'fail';
        setError(atob(result.stderr));
      } else if (result.compile_output) {
        buildStatus = 'fail';
        setError(atob(result.compile_output));
      }

      console.log('Build Status:', buildStatus);
  
    } catch (err) {
      buildStatus = 'fail';
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsRunning(false);

      console.log('Final Build Status:', buildStatus);
    }
  };
  

  return (
    <div className="bg-gray-900 text-white rounded-lg overflow-hidden">
      {/* Hidden video element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="hidden"
      />
      
      {/* Editor Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <span>Main.cs</span>
        <div className="flex items-center space-x-4">
          {/* Recording Status */}
          {isCapturing && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm">Recording</span>
                <span className="text-sm text-gray-400">
                  Next capture in: {timeUntilNextCapture}s
                </span>
              </div>
              <button
                onClick={onViewImages}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-2"
              >
                <span>View Captures ({capturedImages.length})</span>
              </button>
            </div>
          )}
          <button 
            onClick={handleRunCode}
            disabled={isRunning}
            className={`px-4 py-2 rounded flex items-center space-x-2 ${
              isRunning 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600'
            }`} 
          >
            {isRunning ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Running...
              </>
            ) : (
              'Run'
            )}
          </button>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded">
            Submit
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-[2fr,1fr] h-[calc(100vh-64px)]">
        {/* Editor */}
        <div className="h-full border-r border-[#2d2d2d]">
          <Editor
            height="100%"
            defaultLanguage="csharp"
            theme="custom-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            beforeMount={handleEditorWillMount}
            onMount={handleEditorDidMount}
            options={{
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
              minimap: { enabled: false },
              renderLineHighlight: 'none',
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible'
              },
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              overviewRulerBorder: false,
              automaticLayout: true,
              padding: { top: 10, bottom: 10 },
              lineNumbersMinChars: 3,
              lineDecorationsWidth: 0,
              glyphMargin: false,
              folding: false,
            }}
          />
        </div>

        {/* Right Panel */}
        <div className="flex flex-col h-full">
          {/* Instructions */}
          <div className="p-4 border-b border-[#2d2d2d]">
            <h2 className="text-white text-lg font-semibold mb-2">Instructions</h2>
            <p className="text-gray-300">
              Complete the program to display "Hello, World!"
            </p>
          </div>

          {/* Output Panel */}
          <div className="p-4 ">
            <h2 className="text-white text-lg font-semibold mb-2">Output</h2>
            <div className="bg-black rounded p-3 min-h-[100px] font-mono">
              {isRunning ? (
                <div className="text-yellow-400">
                  <svg className="animate-spin inline h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Executing code...
                </div>
              ) : error ? (
                <div className="text-red-400 whitespace-pre-wrap">
                  <div className="font-bold mb-1">Error:</div>
                  {error}
                </div>
              ) : output ? (
                <div className="text-green-400 whitespace-pre-wrap">
                  <div className="font-bold mb-1">Program Output:</div>
                  {output}
                </div>
              ) : (
                <div className="text-gray-500">
                  Program output will appear here...
                  <div className="text-sm mt-2">
                    Press "Run" or Ctrl+Enter to execute the code
                  </div>
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
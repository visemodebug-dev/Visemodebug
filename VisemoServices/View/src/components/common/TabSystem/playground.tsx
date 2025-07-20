import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import * as monacoEditor from "monaco-editor";
import Navbar from "../../dashboards/Navbar";

const DEFAULT_CODE = `using System;

public class Program
{
    public static void Main(string[] args)
    {
        Console.WriteLine("Hello, World!");
    }
}`;

const Playground: React.FC = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorWillMount = (monaco: typeof monacoEditor) => {
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
      },
    });
  };

  const handleEditorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor
  ) => {
    editorRef.current = editor;

    editor.addAction({
      id: "run-code",
      label: "Run Code",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: handleRunCode,
    });
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput("");

    try {
      const currentCode = editorRef.current?.getValue() || "";

      const response = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": "04bbcf18ecmsh2ef5d6c16bb95bdp180920jsn4bfff42108cb",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
          body: JSON.stringify({
            language_id: 51,
            source_code: btoa(currentCode),
            stdin: "",
            base64_encoded: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.stdout) {
        setOutput(atob(result.stdout));
      } else if (result.stderr) {
        setError(atob(result.stderr));
      } else if (result.compile_output) {
        setError(atob(result.compile_output));
      } else {
        setError(result.status?.description || "Unknown error occurred.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while executing code");
    } finally {
      setIsRunning(false);
    }
  };

  return (
  <div className="flex flex-col h-screen overflow-hidden">
    {/* Navbar fixed at top */}
    <div className="fixed top-0 left-0 right-0 z-50">
      <Navbar />
    </div>

    {/* Content below navbar */}
    <div className="flex-1 bg-gray-900 text-white pt-16 overflow-hidden">
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <span>Main.cs</span>
        <div className="flex items-center space-x-4">
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
        </div>
      </div>

      <div className="grid grid-cols-[2fr,1fr] h-[calc(100vh-64px-48px)] overflow-hidden">
        <div className="h-full border-r border-[#2d2d2d] overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="csharp"
            theme="custom-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            beforeMount={handleEditorWillMount}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        <div className="flex flex-col h-full">
          <div className="p-4">
            <h2 className="text-white text-lg font-semibold mb-2">Output</h2>
            <div className="bg-black rounded p-3 min-h-[100px] font-mono overflow-y-auto">
              {isRunning ? (
                <div className="text-yellow-400">Executing code…</div>
              ) : error ? (
                <div className="text-red-400 whitespace-pre-wrap">{error}</div>
              ) : output ? (
                <div className="text-green-400 whitespace-pre-wrap">{output}</div>
              ) : (
                <div className="text-gray-500">
                  Program output will appear here…
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default Playground;

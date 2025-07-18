import React, { useEffect, useState } from "react";
import CodeEditor from "../../student_dash/ActivityPage/CodeEditor";
import Navbar from "../../Navbar";  // adjust path
import { getSubmittedCode } from "../../../../api/classroomApi";
import { useParams } from "react-router-dom";

const TeacherIde: React.FC = () => {
  const { activityId, userId } = useParams<{ activityId: string; userId: string }>();

  const [code, setCode] = useState<string>("Loading...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCode = async () => {
      if (!activityId || !userId) {
        setError("Invalid parameters.");
        setLoading(false);
        return;
      }

      try {
        const result = await getSubmittedCode(Number(activityId), Number(userId));
        if (!result || !result.code) {
          setCode("// No code submitted yet.");
        } else {
          setCode(result.code);
        }
      } catch (err) {
        console.error("Failed to fetch submitted code", err);
        setError("Failed to load code.");
      } finally {
        setLoading(false);
      }
    };

    fetchCode();
  }, [activityId, userId]);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p>Loading submitted code...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Navbar user={{ name: "Teacher Name", role: "Teacher" }} logoText="VISEMO" />

      <div className="flex-1">
        <CodeEditor
          activityId={Number(activityId)}
          instruction="Viewing student submission"
          readonly
          submittedCode={code}
          isCapturing={false}
          stream={null}
          onSnapshot={() => {}}
          capturedImages={[]}
          onViewImages={() => {}}
          runBuild={"success"}
        />
      </div>
    </div>
  );
};

export default TeacherIde;

import React, { useEffect, useState } from "react";
import { Activity } from "../../../../types/classroom";
import { startActivity, stopActivity, getActivities } from "../../../../api/classroomApi";
import PreAssessment from "./PreAssessment";
import CameraAccess from "../../student_dash/ActivityPage/CameraAccess";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface ActivityDetailsProps {
  activity: Activity;
  onBack: () => void;
  role: "Teacher" | "Student";
}

const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

const ActivityDetails: React.FC<ActivityDetailsProps> = ({ activity, onBack, role }) => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isStartedByTeacher, setIsStartedByTeacher] = useState(false);
  const [step, setStep] = useState<"details" | "pre" | "camera">("details");

  const [emotionData, setEmotionData] = useState([
    { name: "Positive", value: 10 },
    { name: "Neutral", value: 10 },
    { name: "Negative", value: 10 }
  ]);

  const parseTime = (timeStr: string) => {
    const [hh, mm, ss] = timeStr.split(":").map(Number);
    return hh * 3600 + mm * 60 + ss;
  };

  const initialSeconds = parseTime(activity.timer);

  const handleTeacherStart = async () => {
    await startActivity(activity.id);
    setIsStartedByTeacher(true);
    setIsRunning(true);
  };

  const handleTeacherStop = async () => {
    await stopActivity(activity.id);
    setIsStartedByTeacher(false);
    setSecondsLeft(initialSeconds);
    setIsRunning(false);
  };

  const handleStudentStart = () => {
    if (isStartedByTeacher) {
      setStep("pre");
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });

      // Simulate emotions changing over time
      setEmotionData((prev) =>
        prev.map((e) => ({
          ...e,
          value: Math.max(0, e.value + Math.floor(Math.random() * 3 - 1)) // +/-1
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (role !== "Student") return;

    const interval = setInterval(async () => {
      try {
        const activities: Activity[] = await getActivities(activity.classroomId);
        const updated = activities.find((a) => a.id === activity.id);

        if (updated?.isStarted) {
          setIsStartedByTeacher(true);
          if (!isRunning) {
            setSecondsLeft(parseTime(updated.timer));
            setIsRunning(true);
          }
        } else {
          setIsStartedByTeacher(false);
          setIsRunning(false);
        }
      } catch (err) {
        console.error("Failed to fetch activity status", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activity.id, activity.classroomId, role, isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  if (step === "pre") {
    return (
      <PreAssessment
        activityId={String(activity.id)}
        onComplete={() => setStep("camera")}
      />
    );
  }

  if (step === "camera") {
    return <CameraAccess activityId={activity.id} />;
  }

  return (
    <div className="w-full p-4">
      <button
        onClick={onBack}
        className="flex items-center text-black hover:underline mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Activities
      </button>

      <h1 className="text-2xl font-bold">{activity.name}</h1>
      <p className="mt-2 text-sm text-gray-700">{activity.instruction || "No instructions provided."}</p>

      <hr className="my-4" />

      <div className="flex justify-between items-start gap-4">
        {/* Left: Timer & Button */}
        {/* Top Section: Timer + Buttons */}
<div className="flex flex-col gap-4">
  <div className="flex items-center gap-4">
    <p className="font-mono text-xl">{formatTime(secondsLeft)}</p>

    {role === "Teacher" && (
      !isStartedByTeacher ? (
        <button
          onClick={handleTeacherStart}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Start Activity
        </button>
      ) : (
        <button
          onClick={handleTeacherStop}
          className="px-4 py-2 bg-yellow-400 text-black rounded"
        >
          Pause Activity
        </button>
      )
    )}

    {role === "Student" && (
      <button
        onClick={handleStudentStart}
        disabled={!isStartedByTeacher}
        className={`px-4 py-2 rounded text-white ${
          isStartedByTeacher ? "bg-green-500" : "bg-gray-400"
        }`}
      >
        {isStartedByTeacher ? "Start Activity" : "Waiting for Teacher…"}
      </button>
    )}
  </div>

  {/* Student Works Section (only for teachers) */}
  {role === "Teacher" && (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-2">Student Works</h2>
      <p>😄 Carl Andre Interino</p>
      <p>😮 Ckhyle Tamayo</p>
      <p>😩 Ckhyle Tamayo ❗</p>
    </div>
  )}
</div>

        {/* Right: Pie Chart */}
        {role === "Teacher" && (
          <div className="flex-1 max-w-xs">
            <h2 className="text-lg font-bold mb-2">Emotion Overview</h2>
            <PieChart width={300} height={300}>
              <Pie
                data={emotionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {emotionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityDetails;

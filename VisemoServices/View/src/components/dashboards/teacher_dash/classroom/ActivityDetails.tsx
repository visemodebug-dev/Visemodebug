import React, { useEffect, useState } from "react";
import { Activity } from "../../../../types/classroom";
import { startActivity, stopActivity, getActivities } from "../../../../api/classroomApi";

interface ActivityDetailsProps {
  activity: Activity;
  onBack: () => void;
  role: "Teacher" | "Student";
}

const ActivityDetails: React.FC<ActivityDetailsProps> = ({ activity, onBack, role }) => {
  const initialSeconds = (() => {
    const [hh, mm, ss] = activity.timer.split(":").map(Number);
    return hh * 3600 + mm * 60 + ss;
  })();

  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isStartedByTeacher, setIsStartedByTeacher] = useState(false);

  // Poll teacher's status every 3s (only for student)
  useEffect(() => {
    if (role !== "Student") return;

    const interval = setInterval(async () => {
      try {
        const activities: Activity[] = await getActivities(activity.classroomId);
        const updated = activities.find(a => a.id === activity.id);

        if (updated) {
          setIsStartedByTeacher(updated.isStarted ?? false);
        }
      } catch (err) {
        console.error("Failed to fetch activity status", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activity.id, activity.classroomId, role]);

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    }

    if (secondsLeft === 0 && interval) {
      clearInterval(interval);
      setIsRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  const formatTime = (totalSeconds: number) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const handleTeacherStart = async () => {
  try {
    console.log("Starting activity:", activity);
    await startActivity(activity.id);
    setIsStartedByTeacher(true);
    setIsRunning(true);
  } catch (err) {
    console.error("Failed to start activity", err);
  }
};

const handleTeacherStop = async () => {
  try {
    await stopActivity(activity.id);
    setIsStartedByTeacher(false);
    setIsRunning(false);
    setSecondsLeft(initialSeconds); // optional: reset timer
  } catch (err) {
    console.error("Failed to stop activity", err);
  }
};

  const handleStudentStart = () => {
    if (isStartedByTeacher) {
      setIsRunning(true);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={onBack}
        className="flex items-center text-black hover:underline mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Activities
      </button>

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">{activity.name}</h1>
        <p className="text-sm text-gray-600 mb-2">
          Created: {new Date(activity.createdAt).toLocaleString()}
        </p>
        <p className="text-sm mb-2">Timer: {activity.timer}</p>
        <p className="text-sm mb-4">
          Current Countdown: <span className="font-mono">{formatTime(secondsLeft)}</span>
        </p>
        <p className="mt-4">{activity.instruction || "No instructions provided."}</p>

        <div className="flex gap-2 mt-4">
          {role === "Teacher" && (
            <>
              {!isStartedByTeacher ? (
                <button
                  onClick={handleTeacherStart}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Start Activity
                </button>
              ) : (
                <button
                  onClick={handleTeacherStop}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Stop Activity
                </button>
              )}
            </>
          )}

          {role === "Student" && (
            <button
              onClick={handleStudentStart}
              disabled={!isStartedByTeacher}
              className={`px-4 py-2 rounded text-white ${
                isStartedByTeacher
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isStartedByTeacher ? "Start Activity" : "Waiting for Teacher…"}
            </button>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold">Student Works (placeholder)</h2>
          <p>Submitted: -</p>
          <p>Not Submitted: -</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;

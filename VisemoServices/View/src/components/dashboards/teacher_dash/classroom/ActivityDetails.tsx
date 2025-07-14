import React, { useEffect, useState } from "react";
import { Activity } from "../../../../types/classroom";
import { startActivity, stopActivity, getActivities } from "../../../../api/classroomApi";
import PreAssessment from "./PreAssessment";
import CameraAccess from "../../student_dash/ActivityPage/CameraAccess";

interface ActivityDetailsProps {
  activity: Activity;
  onBack: () => void;
  role: "Teacher" | "Student";
}

const ActivityDetails: React.FC<ActivityDetailsProps> = ({ activity, onBack, role }) => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isStartedByTeacher, setIsStartedByTeacher] = useState(false);
  const [step, setStep] = useState<"details" | "pre" | "camera">("details");

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

  // render PRE step
  if (step === "pre") {
    return (
      <PreAssessment
        activityId={String(activity.id)}
        onComplete={() => setStep("camera")}
      />
    );
  }

  // render CAMERA step
  if (step === "camera") {
  return <CameraAccess activityId={activity.id} />;
}

  // default: render DETAILS
  return (
    <div className="w-full">
      <button
        onClick={onBack}
        className="flex items-center text-black hover:underline mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Activities
      </button>

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">{activity.name}</h1>
        <p className="text-sm">Created: {new Date(activity.createdAt).toLocaleString()}</p>
        <p className="text-sm">Timer: {activity.timer}</p>
        <p className="text-sm">
          Countdown: <span className="font-mono">{formatTime(secondsLeft)}</span>
        </p>
        <p className="mt-4">{activity.instruction || "No instructions provided."}</p>

        <div className="flex gap-2 mt-4">
          {role === "Teacher" && (
            !isStartedByTeacher ? (
              <button onClick={handleTeacherStart} className="px-4 py-2 bg-green-500 text-white rounded">
                Start Activity
              </button>
            ) : (
              <button onClick={handleTeacherStop} className="px-4 py-2 bg-red-500 text-white rounded">
                Stop Activity
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

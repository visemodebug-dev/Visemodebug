import React, { useEffect, useState } from "react";
import { Activity } from "../../../../types/classroom";
import {
  startActivity,
  stopActivity,
  getActivities,
  fetchAggregatedEmotions,
  getClassroomUsers,
  fetchStudentStatus,
  fetchSubmissionStatus,
  getGenerateReport,
} from "../../../../api/classroomApi";
import PreAssessment from "./PreAssessment";
import CameraAccess from "../../student_dash/ActivityPage/CameraAccess";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface ActivityDetailsProps {
  activity: Activity;
  onBack: () => void;
  role: "Teacher" | "Student";
}

const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

const ActivityDetails: React.FC<ActivityDetailsProps> = ({
  activity,
  onBack,
  role,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isStartedByTeacher, setIsStartedByTeacher] = useState(false);
  const [step, setStep] = useState<"details" | "pre" | "camera">("details");
  const [submitted, setSubmitted] = useState<boolean | null>(null);
  const [students, setStudents] = useState<
    { id: number; firstName: string; lastName: string; role: string }[]
  >([]);
  const [selectedStudent, setSelectedStudent] = useState<{
    id: number;
    firstName: string;
    lastName: string;
    role: string;
  } | null>(null);
  const [emotionData, setEmotionData] = useState([
    { name: "Positive", value: 0 },
    { name: "Neutral", value: 0 },
    { name: "Negative", value: 0 },
  ]);
  const [modalData, setModalData] = useState<any>(null);

  const parseTime = (timeStr: string) => {
    const [hh, mm, ss] = timeStr.split(":").map(Number);
    return hh * 3600 + mm * 60 + ss;
  };

  const initialSeconds = parseTime(activity.timer);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const elapsedTime = initialSeconds - secondsLeft;
  const INTERPRETATION_UNLOCK_SECONDS = 600;

  // Teacher starts activity
  const handleTeacherStart = async () => {
    const userId = Number(localStorage.getItem("userId"));
    if (!userId) return;

    await startActivity(activity.id, userId);
    setIsStartedByTeacher(true);
    setIsRunning(true);
  };

  const handleTeacherStop = async () => {
    await stopActivity(activity.id);
    setIsStartedByTeacher(false);
    setIsRunning(false);
  };

  const handleStudentStart = () => {
    if (isStartedByTeacher) setStep("pre");
  };

  useEffect(() => {
    const userId = Number(localStorage.getItem("userId"));
    if (role === "Student" && userId) {
      fetchSubmissionStatus(activity.id, userId).then((result) =>
        setSubmitted(result.hasSubmitted)
      );
    }
  }, [activity.id, role]);

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
    }, 3000);

    return () => clearInterval(interval);
  }, [activity.id, activity.classroomId, role, isRunning]);

  const setEmotionPercentages = (data: {
    Positive: number;
    Neutral: number;
    Negative: number;
  }) => {
    const total = data.Positive + data.Neutral + data.Negative || 1;
    setEmotionData([
      { name: "Positive", value: Math.round((data.Positive / total) * 100) },
      { name: "Neutral", value: Math.round((data.Neutral / total) * 100) },
      { name: "Negative", value: Math.round((data.Negative / total) * 100) },
    ]);
  };

  useEffect(() => {
    if (role !== "Teacher" || !isRunning) return;

    const interval = setInterval(async () => {
      if (!selectedStudent) {
        const result = await fetchAggregatedEmotions(activity.id);
        setEmotionPercentages({
          Positive: result.totalPositiveEmotions || 0,
          Neutral: result.totalNeutralEmotions || 0,
          Negative: result.totalNegativeEmotions || 0,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isRunning, role, activity.id, selectedStudent]);

  useEffect(() => {
    if (role !== "Teacher") return;

    getClassroomUsers(activity.classroomId).then((users) => {
      setStudents(users.filter((u: any) => u.role === "Student"));
    });
  }, [role, activity.classroomId]);

  const handleStudentClick = (student: typeof students[0]) => {
    if (selectedStudent?.id === student.id) {
      setSelectedStudent(null);
      setSubmitted(null);
      fetchAggregatedEmotions(activity.id).then((result) =>
        setEmotionPercentages({
          Positive: result.totalPositiveEmotions || 0,
          Neutral: result.totalNeutralEmotions || 0,
          Negative: result.totalNegativeEmotions || 0,
        })
      );
    } else {
      setSelectedStudent(student);
      fetchStudentStatus(activity.id, student.id).then((result) => {
        setEmotionPercentages({
          Positive: result.emotions.positive || 0,
          Neutral: result.emotions.neutral || 0,
          Negative: result.emotions.negative || 0,
        });
      });
      fetchSubmissionStatus(activity.id, student.id).then((result) => {
        setSubmitted(result.hasSubmitted);
      });
    }
  };

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
        ← Back to Activities
      </button>

      <h1 className="text-2xl font-bold">{activity.name}</h1>
      <p className="mt-2 text-sm text-gray-700">
        {activity.instruction || "No instructions provided."}
      </p>

      <hr className="my-4" />

      <div className="flex gap-4 w-full">
        <div className="w-1/3 border-r pr-4">
          {(role === "Teacher" || (role === "Student" && !submitted)) && (
            <p className="font-mono text-xl mb-4">{formatTime(secondsLeft)}</p>
          )}

          {/* Teacher Buttons */}
          {role === "Teacher" &&
            (!isStartedByTeacher ? (
              <button
                onClick={handleTeacherStart}
                className="px-4 py-2 bg-green-500 text-white rounded mb-4"
              >
                Start Activity
              </button>
            ) : (
              <button
                onClick={handleTeacherStop}
                className="px-4 py-2 bg-yellow-400 text-black rounded mb-4"
              >
                Pause Activity
              </button>
            ))}

          {/* Student Buttons */}
          {role === "Student" &&
            (submitted ? (
              <button
                onClick={() => {
                  const userId = Number(localStorage.getItem("userId"));
                  window.open(
                    `/teacher-ide/${activity.id}/${userId}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
              >
                View Activity
              </button>
            ) : (
              <button
                onClick={handleStudentStart}
                disabled={!isStartedByTeacher}
                className={`px-4 py-2 rounded text-white mb-4 ${
                  isStartedByTeacher ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                {isStartedByTeacher ? "Start Activity" : "Waiting for Teacher…"}
              </button>
            ))}

          {/* Teacher Student List */}
          {role === "Teacher" && (
            <div>
              <h2 className="text-lg font-bold mb-2">Student Works</h2>
              <div className="flex flex-col">
                {students.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => handleStudentClick(student)}
                    className={`cursor-pointer px-4 py-2 border-b ${
                      selectedStudent?.id === student.id
                        ? "bg-gray-300 font-semibold"
                        : "hover:bg-gray-300"
                    }`}
                  >
                    {student.firstName} {student.lastName}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Teacher Emotion Data */}
        {role === "Teacher" && (
          <div className="flex-1 p-4">
            <h2 className="text-lg font-bold mt-4">
              {selectedStudent
                ? `Emotion Overview: ${selectedStudent.firstName} ${selectedStudent.lastName}`
                : "Class Emotion Overview"}
            </h2>

            <PieChart width={300} height={300}>
              <Pie
                data={emotionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                onClick={async () => {
                  if (
                    selectedStudent &&
                    elapsedTime >= INTERPRETATION_UNLOCK_SECONDS
                  ) {
                    const report = await getGenerateReport(
                      activity.id,
                      selectedStudent.id
                    );
                    setModalData(report);
                  }
                }}
              >
                {emotionData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string) => [`${value}%`, name]} />
              <Legend />
            </PieChart>
          </div>
        )}
      </div>

      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-8 rounded-lg shadow-lg w-[400px] relative">
            <button
              onClick={() => setModalData(null)}
              className="absolute top-2 right-2 text-xl border rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✖
            </button>

            <div className="text-xl font-bold mb-4">
              Interpretation for {selectedStudent?.firstName} {selectedStudent?.lastName}
            </div>

            {modalData.error ? (
              <div className="text-red-600">{modalData.error}</div>
            ) : (
              <div className="text-sm">
                {modalData.interpretation || "No interpretation available."}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityDetails;

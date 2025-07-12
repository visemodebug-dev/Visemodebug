import React, { useState } from "react";
import ActivitiesTab from "./ActivitiesTab";
import StudentTab from "./StudentTab";
import ActivityDetails from "./ActivityDetails";
import { Activity } from "../../../../types/classroom";
import PreAssessment from "./PreAssessment";

interface ClassroomTabsProps {
  classroomId: number;
  role: "Teacher" | "Student";
}

const ClassroomTabs: React.FC<ClassroomTabsProps> = ({ classroomId, role }) => {
  const [activeTab, setActiveTab] = useState<"activities" | "students">("activities");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showPreAssessment, setShowPreAssessment] = useState(false);

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowPreAssessment(false);
  };

  const handleBackToActivities = () => {
    setSelectedActivity(null);
    setShowPreAssessment(false);
  };
  
  return (
    <div className="p-6 mt-3 bg-gray-100 min-h-[400px] rounded-lg">
      <div className="flex border-b border-gray-400 shadow-sm">
        <button
          onClick={() => {
            setActiveTab("activities");
            setSelectedActivity(null);
            setShowPreAssessment(false);
          }}
          className={`px-6 py-2 font-bold border rounded-t-lg ${
            activeTab === "activities" ? "bg-green-100 border-green-600" : "border-transparent"
          }`}
        >
          Activities
        </button>
        <button
          onClick={() => {
            setActiveTab("students");
            setSelectedActivity(null);
            setShowPreAssessment(false);
          }}
          className={`px-6 py-2 font-bold border rounded-t-lg ${
            activeTab === "students" ? "bg-orange-200 border-orange-600" : "border-transparent"
          }`}
        >
          Students
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "activities" && (
          <>
            {showPreAssessment && selectedActivity && (
              <PreAssessment
                activityId={selectedActivity.id.toString()}
                onComplete={(hasConcerns, reasons) => {
                  console.log("PreAssessment completed", { hasConcerns, reasons });
                  setShowPreAssessment(false);
                  setSelectedActivity(null);
                }}
              />
            )}

            {!showPreAssessment && selectedActivity && (
              <ActivityDetails
                activity={selectedActivity}
                onBack={handleBackToActivities}
                role={role}
              />
            )}

            {!selectedActivity && !showPreAssessment && (
              <ActivitiesTab
                classroomId={classroomId}
                role={role}
                hideCreateButton={role === "Student"}
                onActivityClick={handleActivityClick}
              />
            )}
          </>
        )}


        {activeTab === "students" && (
          <StudentTab classroomId={classroomId} role={role} />
        )}
      </div>
    </div>
  );
};

export default ClassroomTabs;

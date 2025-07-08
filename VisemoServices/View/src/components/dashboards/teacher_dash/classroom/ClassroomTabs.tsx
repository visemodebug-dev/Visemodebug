import React, {useState} from "react";
import ActivitiesTab from "./ActivitiesTab";
import StudentTab from "./StudentTab";

interface ClassroomTabsProps {
    classroomId: number;
}

const ClassroomTabs: React.FC<ClassroomTabsProps> = ({ classroomId }) => {
    const [activeTab, setActiveTab] = useState<"activities" | "students">("activities");

    return (
        <div className="p-6 mt-3 bg-gray-100 min-h-[400px] rounded-lg">
            <div className="flex border-b border-gray-400 shadow-sm">
                <button
                onClick={() => setActiveTab("activities")}
                className={`px-6 py-2 font-bold border rounded-t-lg ${
                    activeTab === "activities" ? "bg-green-100 border-green-600" : "border-transparent"
                }`}>
                    Activities
                </button>
                <button
                onClick={() => setActiveTab("students")}
                className={`px-6 py-2 font-bold border rounded-t-lg ${
                    activeTab === "students" ? "bg-orange-200 border-orange-600" : "border-transparent"
                }`}>
                    Students
                </button>
            </div>

            <div className="mt-4">
                {activeTab === "activities" && <ActivitiesTab classroomId={classroomId} />}
                {activeTab === "students" && <StudentTab classroomId={classroomId} />}
            </div>
        </div>
    )
}

export default ClassroomTabs;
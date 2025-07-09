import React, { useState, useEffect, useCallback } from "react";
import { getActivities } from "../../../../api/classroomApi";
import CreateActivity from "./CreateActivity";
import { Activity } from "../../../../types/classroom";

interface ActivitiesTabProps {
  classroomId: number;
  onActivityClick?: (activity: Activity) => void;
  hideCreateButton?: boolean;
  role: "Teacher" | "Student";
}

const ActivitiesTab: React.FC<ActivitiesTabProps> = ({
  classroomId,
  onActivityClick,
  hideCreateButton,
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  const fetchActivities = useCallback(async () => {
    try {
      const data = await getActivities(classroomId);
      console.log("Fetched activities:", data);

      if (Array.isArray(data)) {
        setActivities(data);
      } else if (data && Array.isArray(data.activities)) {
        setActivities(data.activities);
      } else {
        setActivities([]);
      }
    } catch (err) {
      console.error("Failed to load activities", err);
      setActivities([]);
    }
  }, [classroomId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return (
    <div className="w-full">
      {!hideCreateButton && (
        <div className="flex justify-center my-6">
          <button
            onClick={() => setShowCreate(true)}
            className="bg-yellow-400 text-lg font-bold px-6 py-2 rounded-full hover:scale-105 transition flex items-center gap-2 shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Activity
          </button>
        </div>
      )}

      {showCreate && (
        <CreateActivity
          classroomId={classroomId}
          onClose={() => setShowCreate(false)}
          onCreated={fetchActivities}
        />
      )}

      <div className="mt-8">
        {activities.length === 0 ? (
          <p className="text-center text-gray-500">No activities yet.</p>
        ) : (
          activities.map((act) => (
            <div
              key={act.id}
              onClick={() => onActivityClick?.(act)}
              className="p-4 rounded border border-black shadow mb-4 cursor-pointer"
            >
              <h3 className="text-lg font-semibold">{act.name}</h3>
              <p className="text-sm">Timer: {act.timer}</p>
              <p className="text-xs text-gray-600 mt-2">
                Created: {new Date(act.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivitiesTab;

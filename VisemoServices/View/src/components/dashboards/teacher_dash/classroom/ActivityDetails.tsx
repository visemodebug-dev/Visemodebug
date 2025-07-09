import React from "react";
import { Activity } from "../../../../types/classroom";

interface ActivityDetailsProps {
  activity: Activity;
  onBack: () => void;
}

const ActivityDetails: React.FC<ActivityDetailsProps> = ({ activity, onBack }) => {
    

  return (
    <div className="w-full">
      <button
        onClick={onBack}
        className="flex items-center text-black hover:underline mb-4"
      >
        <svg
          xmlns="back-button-svgrepo-com.svg"
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
        <p className="mt-4">
          {activity.instruction || "No instructions provided."}
        </p>

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

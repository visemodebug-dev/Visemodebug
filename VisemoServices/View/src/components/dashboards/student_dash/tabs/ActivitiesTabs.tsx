// src/components/dashboards/student_dash/tabs/ActivitiesTabs.tsx
import React from 'react';
import { Activity } from '../../../../types/class';

interface ActivitiesTabProps {
  activities: Activity[];
  onActivityClick: (activityId: string) => void;
}

const ActivitiesTab: React.FC<ActivitiesTabProps> = ({ activities, onActivityClick }) => {
  return (
    <div className="p-6">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id}
            onClick={() => onActivityClick(activity.id)}
            className="bg-white rounded-lg border-2 border-black-500 p-4 flex justify-between items-center cursor-pointer hover:shadow-sm transition-all duration-200"
          >
            <span className="font-medium">{activity.title}</span>
            <span className="text-gray-600">{activity.timeAndDate}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesTab;
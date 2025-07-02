// src/components/dashboards/student_dash/components/ActivityItem.tsx
import React from 'react';

interface ActivityItemProps {
  title: string;
  dateTime: string;
  onClick?: () => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ title, dateTime, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg p-4 flex justify-between items-center cursor-pointer hover:shadow-sm transition-all duration-200"
    >
      <span className="font-medium">{title}</span>
      <span className="text-gray-600">{dateTime}</span>
    </div>
  );
};

export default ActivityItem;
// ClassCard.tsx
import React from 'react';

interface ClassCardProps {
  id: string;
  className: string;
  teacherName: string;
  activities: string[];
  onClick: (id: string) => void;  // Add onClick prop
}

const ClassCard: React.FC<ClassCardProps> = ({ 
  id, 
  className, 
  teacherName, 
  activities,
  onClick 
}) => {
  const getTextSize = (text: string, type: 'title' | 'name' | 'activity') => {
    switch(type) {
      case 'title':
        if (text.length > 20) return 'text-lg';
        if (text.length > 10) return 'text-xl';
        return 'text-2xl';
      case 'name':
        if (text.length > 25) return 'text-sm';
        return 'text-base';
      case 'activity':
        if (text.length > 30) return 'text-sm';
        return 'text-base';
      default:
        return 'text-base';
    }
  };

  return (
    <div 
      className="w-full bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer transition-transform hover:shadow-lg"
      onClick={() => onClick(id)} 
    >
      {/* Header Section */}
      <div className="relative h-24 sm:h-24 bg-yellow-300 p-4 flex flex-col justify-between">
        <div>
        <h2 className={`font-bold text-black break-words ${getTextSize(className, 'title')}`}> {className}</h2>
        <p className={`text-black ${getTextSize(teacherName, 'name')}`}>{teacherName}</p>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-6 border-t">
        <ul className="list-disc pl-5 space-y-2">
          {activities.map((activity, index) => (
            <li key={index} className={`text-black break-words ${getTextSize(activity, 'activity')}`}
            >
              {activity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClassCard; 
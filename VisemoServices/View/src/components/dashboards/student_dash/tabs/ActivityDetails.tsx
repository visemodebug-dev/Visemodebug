import React, { useState,} from 'react';
import { Activity } from '../../../../types/class';
import CircularProgress from '@mui/material/CircularProgress';

interface ActivityDetailsProps {
  activity: Activity;
  onBack: () => void;
}

const ActivityDetails: React.FC<ActivityDetailsProps> = ({ activity }) => {
  const [isStarted, setIsStarted] = useState(() => {
    return localStorage.getItem(`activity-${activity.id}-started`) === 'true';
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleActivityClick = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const url = `/student-dashboard/activity/${activity.id}`;
      window.open(url, '_blank');
      setIsStarted(true);
      localStorage.setItem(`activity-${activity.id}-started`, 'true');
    } catch (error) {
      console.error('Error opening activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">{activity.title}</h1>
      <div className="mb-8">
        <p className="text-gray-700">{activity.description}</p>
      </div>
      <div className="flex justify-center">
        <button 
          onClick={handleActivityClick}
          disabled={isLoading}
          className={`
            px-8 py-3 rounded-full font-medium transition-all duration-200
            flex items-center justify-center min-w-[160px]
            ${isLoading ? 'cursor-not-allowed opacity-80' : ''}
            ${isStarted 
              ? 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg' 
              : 'bg-yellow-400 text-black hover:bg-yellow-500 hover:shadow-lg'
            }
          `}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            isStarted ? 'Continue' : 'Start Activity'
          )}
        </button>
      </div>
    </div>
  );
};

export default ActivityDetails;
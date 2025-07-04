// src/components/dashboards/student_dash/ClassDetails.tsx
import React, { useState } from 'react';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TabSystem from '../../common/TabSystem/TabSystem';
import ActivitiesTab from './tabs/ActivitiesTabs';
import ActivityDetails from './tabs/ActivityDetails';
import { classesData } from './data/classesData';

const ClassDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate: NavigateFunction = useNavigate();
  const classData = id ? classesData[id] : null;
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const tabs = [
    { 
      id: 'activities', 
      label: selectedActivity ? 'Activity' : 'Activities' 
    }
  ];

  const handleBack = () => {
    if (selectedActivity) {
      // If viewing an activity, go back to activities list
      setSelectedActivity(null);
    } else {
      // If viewing activities list, go back to dashboard
      navigate("/student-dashboard");
    }
  };

  const handleActivityClick = (activityId: string) => {
    setSelectedActivity(activityId);
  };

  if (!classData) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-white text-lg">Class not found</p>
      </div>
    );
  }

  const selectedActivityData = selectedActivity 
    ? classData.activities.find(a => a.id === selectedActivity)
    : null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="mb-4 flex items-center text-white hover:text-gray-200 transition-colors"
      >
        <ArrowBackIcon className="mr-1" />
        {selectedActivity ? 'Back to Activities' : 'Back to Dashboard'}
      </button>

      {/* Header */}
      <div className='pb-3'>
        <div className="bg-yellow-300 rounded-lg p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">{classData.className}</h1>
          <span className="text-sm">{classData.teacherName}</span>
        </div>
      </div>

      <TabSystem
        tabs={tabs}
        activeTab="activities"
        onTabChange={() => {}}
      >
        {!selectedActivity ? (
          <ActivitiesTab 
            activities={classData.activities}
            onActivityClick={handleActivityClick}
          />
        ) : (
          selectedActivityData && (
            <ActivityDetails
              activity={selectedActivityData}
              onBack={() => setSelectedActivity(null)}
            />
          )
        )}
      </TabSystem>
    </div>
  );
};

export default ClassDetails;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ClassCard from '../CLassCard';

interface Class {
  id: string;
  className: string;
  teacherName: string;
  activities: string[];
}

// Sample Classes Data
const classes: Class[] = [
  {
    id: "1",
    className: "C# Programming",
    teacherName: "John Smith",
    activities: ["Activity 1", "Activity 2", "Activity 3"]
  },
  {
    id: "2",
    className: "Web Development",
    teacherName: "Jane Doe",
    activities: ["Assignment 1", "Quiz 1", "Project"]
  },
  {
    id: "3",
    className: "Database Management",
    teacherName: "Mike Johnson",
    activities: ["Lab 1", "Midterm", "Final Project"]
  },
  {
    id: "4",
    className: "Mobile Development",
    teacherName: "Sarah Wilson",
    activities: ["Workshop 1", "Assignment 1", "Group Project"]
  },
];

const ClassList: React.FC = () => {
  const navigate = useNavigate();

  const handleClassClick = (classId: string) => {
    navigate(`/student-dashboard/class/${classId}`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          My Classes
        </h1>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {classes.map((classItem) => (
          <div key={classItem.id} className="flex">
            <ClassCard
              id={classItem.id}
              className={classItem.className}
              teacherName={classItem.teacherName}
              activities={classItem.activities}
              onClick={handleClassClick}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {classes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white text-lg">
            No classes available yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClassList;
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import ClassRoomGrid from "../teacher_dash/ClassRoomGrid";
import { getClassrooms } from "../../../api/classroomApi";
import { Classroom, Activity } from "../../../types/classroom";
import ActivityDetails from "../teacher_dash/classroom/ActivityDetails";
import ClassroomDetails from "../teacher_dash/pages/ClassroomDetails";

const StudentLandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // scrolling down
        setIsVisible(false);
      } else {
        // scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const data = await getClassrooms();
        setClassrooms(data);
      } catch (err) {
        console.log("Failed to fetch classrooms", err);
      }
    };

    fetchClassrooms();
  }, []);

  const handleClassClick = (id: number) => {
    const classroom = classrooms.find((c) => c.id === id) || null;
    setSelectedClass(classroom);
    setSelectedActivity(null);
  };

  const handleBackToActivities = () => {
    setSelectedActivity(null);
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* 🔷 Sticky + Hide on Scroll Navbar */}
      <div
        className={`sticky top-0 z-50 transform transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Navbar logoText="VISEMO" />
      </div>

      <div className="flex-1 bg-green-500 overflow-auto">
        {selectedClass === null && (
          <ClassRoomGrid
            classRooms={classrooms}
            onClassClick={handleClassClick}
            role={"Student"}
          />
        )}

        {selectedClass && !selectedActivity && (
          <ClassroomDetails
            classroomId={selectedClass.id as number}
            onBack={handleBackToClasses}
            role="Student"
          />
        )}

        {selectedActivity && (
          <div className="p-4">
            <ActivityDetails
              activity={selectedActivity}
              onBack={handleBackToActivities}
              role="Student"
            />
          </div>
        )}

        <Outlet />
      </div>
    </div>
  );
};

export default StudentLandingPage;

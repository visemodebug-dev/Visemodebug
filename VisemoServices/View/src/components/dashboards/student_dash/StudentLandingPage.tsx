import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import ClassRoomGrid from "../teacher_dash/ClassRoomGrid";
import { getClassrooms } from "../../../api/classroomApi";
import { Classroom, Activity } from "../../../types/classroom";
import ActivityDetails from "../teacher_dash/classroom/ActivityDetails";
import ClassroomDetails from "../teacher_dash/pages/ClassroomDetails";

interface User {
  name: string;
  role: "Student" | "Teacher";
  avatarUrl?: string;
}

const user: User = {
  name: "Carl Andre Interino",
  role: "Student",
  avatarUrl: "/path/to/avatar.jpg",
};

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
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
    <div className="h-screen flex flex-col overflow-hidden">
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        `}
      >
        <Navbar user={user} logoText="VISEMO" />
      </div>

      <div
        className={`
          flex-1 bg-green-500 overflow-auto
          transition-all duration-300
          ${isVisible ? "mt-0" : "-mt-16"}
        `}
      >
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
          </div>
        

        {selectedActivity && (
          <div className="p-4">
            <ActivityDetails activity={selectedActivity} onBack={handleBackToActivities} />
          </div>
        )}

        <Outlet />
      </div>
  );
};

export default StudentLandingPage;

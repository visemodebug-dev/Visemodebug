import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import CreateClass from "./CreateClass";
import { getClassrooms, createClassroom } from "../../../api/classroomApi";
import { Classroom } from "../../../types/classroom";
import ClassRoomGrid from "./ClassRoomGrid";
import ClassroomDetail from "./pages/ClassroomDetails";


const TeacherLandingPage: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);


  // Fetch classrooms
  const fetchClassrooms = async () => {
    const data = await getClassrooms();
    setClassrooms(data);
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleCreateClass = async (className: string) => {
    try {
      const response = await createClassroom(className);
      console.log("Created class response:", response);
      await fetchClassrooms(); 
      setIsCreating(false);
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Failed to create class.");
    }
  };

  // Navbar hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY <= lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleClassClick =(id: number) =>{
    setSelectedClassId(id);
  };
  const handleBackToDashboard = () => {
    setSelectedClassId(null);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        `}
      >
        <Navbar user={{ name: "Carl Andre Interino", role: "Teacher" }} logoText="VISEMO" />
      </div>

      <div className="min-h-screen bg-green-500 relative">
        <div
          className={`
            flex-1 overflow-auto
            transition-all duration-300
            ${isVisible ? "mt-0" : "-mt-16"}
          `}
        >
          {selectedClassId === null && (
          <button
            onClick={() => setIsCreating(true)}
            className="w-16 h-16 bg-white rounded-full 
              flex items-center justify-center 
              hover:scale-105 absolute right-8 top-4 
              transform transition-transform duration-300 ease-in-out 
              shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="black"
              className="w-8 h-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}

          {isCreating && (
            <CreateClass
              onCreate={handleCreateClass}
              onCancel={() => setIsCreating(false)}
            />
          )}

           {selectedClassId ? (
            <ClassroomDetail
              classroomId={selectedClassId}
              onBack={handleBackToDashboard}
            />
          ) : (
            <ClassRoomGrid
              classRooms={classrooms}
              onClassClick={handleClassClick}
            />
          )}
        </div>

        <Outlet />
      </div>  
    </div>
  );
};

export default TeacherLandingPage;

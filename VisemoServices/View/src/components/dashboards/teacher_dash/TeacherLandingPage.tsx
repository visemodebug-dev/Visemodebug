import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import CreateClass from "./CreateClass";
import ClassRoomGrid from "./ClassRoomGrid";
import ClassroomDetail from "./pages/ClassroomDetails";
import {
  getClassrooms,
  createClassroom,
  deleteClassroom,
} from "../../../api/classroomApi";
import { Classroom } from "../../../types/classroom";

const TeacherLandingPage: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  useEffect(() => {
    let lastY = 0;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsVisible(currentY <= lastY);
      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchClassrooms = async () => {
    try {
      const data = await getClassrooms();
      setClassrooms(data);
    } catch (err) {
      console.error("Failed to fetch classrooms", err);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  // Create Class
  const handleCreateClass = async (className: string) => {
    try {
      const response = await createClassroom(className);
      console.log("Created class:", response);
      await fetchClassrooms();
      setIsCreating(false);
      setSelectedClassId(null);
    } catch (err) {
      console.error("Failed to create class", err);
      alert("Failed to create class.");
    }
  };

  /**
   * Delete a classroom
   */
  const handleDeleteClass = async (id: number) => {
    try {
      await deleteClassroom(id);
      setClassrooms((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete classroom", err);
      alert("Failed to delete classroom.");
    }
  };

  const handleClassClick = (id: number) => {
    setSelectedClassId(id);
  };

  const handleBackToDashboard = () => {
    setSelectedClassId(null);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Navbar */}
      <div
        className={`
          transition-all duration-300 ease-in-out z-10 bg-white
          ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        `}
      >
        <Navbar logoText="VISEMO" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-green-500 relative">
        {/* Floating Create Button */}
        {selectedClassId === null && (
          <button
            onClick={() => setIsCreating(true)}
            className="w-16 h-16 bg-white rounded-full 
              flex items-center justify-center 
              hover:scale-105 absolute right-8 top-4 
              transform transition-transform duration-300 ease-in-out 
              shadow-md z-20"
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

        {/* Create Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6">
              <CreateClass
                onCreate={handleCreateClass}
                onCancel={() => setIsCreating(false)}
              />
            </div>
          </div>
        )}

        {/* Main View */}
        {selectedClassId ? (
          <ClassroomDetail
            classroomId={selectedClassId}
            onBack={handleBackToDashboard}
            role="Teacher"
          />
        ) : (
          <div
            className={`${isCreating ? "pointer-events-none opacity-50" : ""}`}
          >
            <ClassRoomGrid
              classRooms={classrooms}
              onClassClick={handleClassClick}
              onDeleteClass={handleDeleteClass}
              role="Teacher"
            />
          </div>
        )}

        <Outlet />
      </div>
    </div>
  );
};

export default TeacherLandingPage;

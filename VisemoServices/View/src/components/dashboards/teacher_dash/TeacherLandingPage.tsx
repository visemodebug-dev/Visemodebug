import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import CreateClass from "./CreateClass";
import { getClassrooms, createClassroom } from "../../../api/classroomApi";
import { Classroom } from "../../../types/classroom";
import ClassRoomGrid from "./ClassRoomGrid";
import ClassroomDetail from "./pages/ClassroomDetails";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7131/api/classroom";


const TeacherLandingPage: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/DeleteClassroom`, {
        params: { id },
      });
      // Remove the deleted class from UI
      setClassrooms((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete classroom", err);
      alert("Failed to delete classroom. Please try again.");
    }
  };

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
      setSelectedClassId(null);
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
    <div className="h-screen flex flex-col bg-green-500 ">
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        `}
      >
        <Navbar user={{ name: "Carl Andre Interino", role: "Teacher" }} logoText="VISEMO" />
      </div>

      <div className="w-full relative">
        <div
          className={`
            flex-1 overflow-auto bg-green-500
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
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6">
              <CreateClass
                onCreate={handleCreateClass}
                onCancel={() => setIsCreating(false)}
              />
            </div>
          </div>
        )}

           {selectedClassId ? (
            <ClassroomDetail
              classroomId={selectedClassId}
              onBack={handleBackToDashboard}
              role="Teacher"
            />
          ) : (
            <div className={`${isCreating ? "pointer-events-none opacity-50" : ""}`}>
              <ClassRoomGrid
                  classRooms={classrooms}
                  onClassClick={handleClassClick}
                  onDeleteClass={handleDelete} role={"Teacher"}              />
            </div>
          )}
        </div>

        <Outlet />
      </div>  
    </div>
  );
};

export default TeacherLandingPage;

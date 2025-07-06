import React, {useState} from "react";
import AddStudent from "./AddStudent";
import axios from "axios";

interface StudentTabProps {
    classroomId: number;
}

const BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7131/api/classroom";

const StudentTab: React.FC<StudentTabProps> = ({classroomId}) =>  {
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState<
    { idNumber: string; name: string }[]>([]);


    const handleAddStudent = async (idNumber: string, name: string) => {
        try {
            const res = await axios.post(`${BASE_URL}/AddUsers`, {
        idNumber,
        name,
        classroomId,
      });
    
        const newStudent = res.data || { idNumber, name };

    setStudents((prev) => [...prev, newStudent]);
    } catch (err) {
      console.error("Failed to add student to classroom", err);
    }
  };

    return (
        <div>
            <div className="flex justify-between items-center my-6"> 
                <div className="font-bold text-lg">Students</div>
                <button 
                onClick={() => setShowModal(true)}
                className="bg-gray-300 px-3 py-1 rounded flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Student
                </button>
            </div>

            {/* List of students */}
      <div className="space-y-2">
        {students.map((student, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-white border rounded-lg px-4 py-2 hover:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-black rounded-full"></span>
              <span>{student.name} ({student.idNumber})</span>
            </div>
            <button className="text-gray-500 hover:text-black">⋮</button>
          </div>
        ))}
      </div>

        {showModal && (
        <AddStudent
          classroomId={classroomId}
          onClose={() => setShowModal(false)}
          onAdd={handleAddStudent}
        />
      )}
        </div>
    );
};

export default StudentTab;
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getClassrooms } from "../../../../api/classroomApi";
import { Classroom } from "../../../../types/classroom";

interface ClassroomDetailProps {
  id: string;
  onBack: () => void;
}

const ClassroomDetail: React.FC<ClassroomDetailProps> = ({ id, onBack }) => {
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState<Classroom | null>(null);

  useEffect(() => {
    const fetchClassroom = async () => {
      const data: Classroom[] = await getClassrooms();
      const found = data.find((c) => c.id.toString() === id);
      setClassroom(found || null);
    };

    fetchClassroom();
  }, [id]);

  if (!classroom) {
    return <div className="p-8">Classroom not found.</div>;
  }

  return (
    <div className="p-8">
      <button
        onClick={onBack}
        className="flex items-center text-white hover:underline mb-4"
      >
        <svg
          xmlns="back-button-svgrepo-com.svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </button>

      {/* 🟨 Header */}
      <div className="bg-yellow-300 rounded-xl shadow-md flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold">{classroom.className}</h1>
        <p className="text-md">{classroom.teacherName}</p>
      </div>

      {/* 🔥 Activities */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Activities</h2>
        <ul className="list-disc list-inside">
          {classroom.activities && classroom.activities.length > 0 ? (
            classroom.activities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))
          ) : (
            <li>No activities available yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ClassroomDetail;

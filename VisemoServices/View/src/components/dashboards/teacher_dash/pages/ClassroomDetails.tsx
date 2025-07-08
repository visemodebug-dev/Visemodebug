import { useEffect, useState } from "react";
import { getClassrooms } from "../../../../api/classroomApi";
import { Classroom } from "../../../../types/classroom";
import ClassroomTabs from "../classroom/ClassroomTabs";

interface ClassroomDetailProps {
  onBack: () => void;
  classroomId: number;
}

const ClassroomDetail: React.FC<ClassroomDetailProps> = ({ onBack, classroomId }) => {
  const [classroom, setClassroom] = useState<Classroom | null>(null);

  useEffect(() => {
    const fetchClassroom = async () => {
      const data: Classroom[] = await getClassrooms();
      const found = data.find((c) => c.id === classroomId);
      setClassroom(found || null);
    };

    fetchClassroom();
  }, [classroomId]);

  if (!classroom) {
    return <div className="p-8">Classroom not found.</div>;
  }

  return (
    <div className="p-5">
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

      
      <div className="bg-yellow-300 rounded-xl shadow-md flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold">{classroom.className}</h1>
        <p className="text-md">{classroom.teacherName}</p>
      </div>

    <ClassroomTabs classroomId={classroomId} />
    </div>
  );
};

export default ClassroomDetail;

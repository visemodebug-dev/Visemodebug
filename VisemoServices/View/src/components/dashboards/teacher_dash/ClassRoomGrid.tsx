import { Classroom } from "../../../types/classroom";
import { Link } from "react-router-dom";

interface ClassRoomGridProps {
  classRooms: Classroom[];
  onClassClick: (id: number) => void;
}

const ClassRoomGrid: React.FC<ClassRoomGridProps> = ({ classRooms, onClassClick }) => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Classes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {classRooms.map((classroom) => (
          <div
          key={classroom.id}
            onClick={() => onClassClick(Number(classroom.id))}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer 
              hover:scale-105 transition-transform duration-200"
          >
            <div className="bg-yellow-300 p-4">
              <h2 className="text-xl font-bold">{classroom.className}</h2>
              <p className="text-sm">Teacher: {classroom.teacherName}</p>
            </div>

            <div className="p-4">
              <ul className="list-disc list-inside">
                {classroom.activities && classroom.activities.length > 0 ? (
                  classroom.activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))
                ) : (
                  <li>No activities yet</li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassRoomGrid;

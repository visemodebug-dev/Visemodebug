import React, {useState, useEffect} from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7131/api/classroom";

interface AddStudentProps {
    onClose: () => void;
    onAdd: (idNumber: string, name: string) => void;
}

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDeboucedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDeboucedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value,delay]);

    return debouncedValue;
};

const AddStudent: React.FC<AddStudentProps> = ({ onClose, onAdd }) => {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState<{ idNumber: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!debouncedQuery.trim()) {
        setStudents([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

    try {
       const res = await axios.get<{ 
            idNumber: string; 
            firstName: string; 
            lastName: string; 
        }[]>(`${BASE_URL}/search`, {
            params: { idNumber: debouncedQuery },
        });
       if (res.data && res.data.length > 0) {
          setStudents(
            res.data.map((student) => ({
              idNumber: student.idNumber,
              name: `${student.firstName} ${student.lastName}`,
            }))
          );
        } else {
          setStudents([]);
          setError("No student found");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching student");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

   fetchStudent();
  }, [debouncedQuery]);

  const handleSelect = (student: { idNumber: string; name: string }) => {
    onAdd(student.idNumber, student.name);
    onClose();
  };

   return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-100 rounded-xl p-6 w-96 shadow">
        <div className="flex items-center gap-2 text-xl font-bold mb-4">
        Add Student
        </div>

        <input
          type="text"
          placeholder="Enter ID Number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border-b border-gray-400 p-2 bg-transparent outline-none mb-4"
        />

        {/* <button
          onClick={() => fetchStudent(usn)}
          className="text-sm text-blue-600 hover:underline mb-4"
        >
          Search
        </button> */}

        {loading && <div className="text-sm text-gray-500">Loading…</div>}

        <ul className="max-h-40 overflow-y-auto">
          {students.map((student) => (
            <li
              key={student.idNumber}
              onClick={() => handleSelect(student)}
              className="p-2 hover:bg-gray-200 cursor-pointer rounded"
            >
              <strong>{student.idNumber}</strong> — {student.name}
            </li>
          ))}
        </ul>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="text-sm hover:underline">
            Cancel
          </button>
          <button
            disabled={!query || students.length === 0}
            onClick={() => {
            if (students[0]) {
                handleSelect(students[0]);
            }
            }}
            className="bg-gray-400 text-black px-4 py-1 rounded-full disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
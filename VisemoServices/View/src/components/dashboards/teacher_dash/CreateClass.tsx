import { useState } from "react";

interface CreateClassProps {
    onCreate: (ClassName: string) => void;
    onCancel: () => void;
}

const CreateClass: React.FC<CreateClassProps> = ({ onCreate, onCancel}) => {
    const [className, setClassName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (className.trim()) {
            onCreate(className);
            setClassName("");
        }
    };

    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-100 p-8 rounded-2xl w-[500px]">
        <h2 className="text-2xl font-bold mb-6">Create Class</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 font-semibold" htmlFor="className">
              Class Name
            </label>
            <input
              id="className"
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full border border-black rounded-md px-3 py-2"
              placeholder="Enter class name"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-400 text-black px-4 py-2 rounded-full hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-yellow-300 text-black px-4 py-2 rounded-full hover:bg-yellow-400"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClass;
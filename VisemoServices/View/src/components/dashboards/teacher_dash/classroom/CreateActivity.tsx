import React, { useState } from "react";
import { createActivity } from "../../../../api/classroomApi";

interface CreateActivityProps {
  classroomId: number;
  onClose: () => void;
  onCreated: () => void;
}

const CreateActivity: React.FC<CreateActivityProps> = ({
  classroomId,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [instruction, setInstruction] = useState("");
  const [duration, setDuration] = useState<number>(30);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const timer = `00:${duration}:00`;

      // Send only what the backend expects
      await createActivity(classroomId, name, timer, instruction);

      onCreated();  // refresh activities
      onClose();    // close modal
    } catch (err) {
      console.error("Failed to create activity", err);
      alert("Failed to create activity. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
      <div className="bg-white w-full md:w-1/2 lg:w-1/3 h-full p-6 shadow-lg animate-slide-in-right overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Create Activity</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Title of Activity</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border p-2 rounded"
              placeholder="Enter title"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Select Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select topic</option>
              <option value="Topic 1">Topic 1</option>
              <option value="Topic 2">Topic 2</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Instructions</label>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              required
              className="w-full border p-2 rounded"
              rows={4}
              placeholder="Enter instructions"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Set Timer (minutes)</label>
            <input
              type="number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="border p-2 rounded w-24"
            />
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateActivity;

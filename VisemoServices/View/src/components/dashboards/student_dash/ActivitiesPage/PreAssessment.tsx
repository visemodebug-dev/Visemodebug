// src/components/dashboards/student_dash/ActivitiesPage/PreAssessment.tsx
import React, { useState, useEffect } from 'react';

interface PreAssessmentProps {
  onComplete: (hasConcerns: boolean, concerns?: string) => void;
  activityId: string;
}

const PreAssessment: React.FC<PreAssessmentProps> = ({ onComplete, activityId }) => {
  const [hasConcerns, setHasConcerns] = useState<boolean | null>(null);
  const [concerns, setConcerns] = useState('');
  const [hasPreviewAssessment, setHasPreviewAssessment] = useState(false);
  const [usePreviousAssessment, setUsePreviousAssessment] = useState<boolean | null>(null);

  useEffect(() => {
    const previousAssessment = localStorage.getItem('previousAssessment');
    if (previousAssessment) {
      setHasPreviewAssessment(true);
    }
  }, []);

  const handleSubmit = () => {
    if (hasConcerns !== null) {
      localStorage.setItem('previousAssessment', JSON.stringify({
        hasConcerns,
        concerns,
        timestamp: new Date().toISOString()
      }));
    }
    onComplete(hasConcerns || false, concerns);
  };

  if (hasPreviewAssessment && usePreviousAssessment === null) {
    return (
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-xl font-bold mb-6">Previous Assessment Found</h2>
        <p className="mb-6">You have already submitted a self-assessment. Do you want it to be the same as the previous?</p>
        
        <div className="space-y-4 mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={usePreviousAssessment === true}
              onChange={() => {
                setUsePreviousAssessment(true);
                const prev = JSON.parse(localStorage.getItem('previousAssessment') || '{}');
                setHasConcerns(prev.hasConcerns);
                setConcerns(prev.concerns);
              }}
              className="form-radio"
            />
            <span>Yes</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={usePreviousAssessment === false}
              onChange={() => setUsePreviousAssessment(false)}
              className="form-radio"
            />
            <span>No</span>
          </label>
        </div>

        {/* Added Submit Button */}
        <button
          onClick={() => {
            if (usePreviousAssessment) {
              const prev = JSON.parse(localStorage.getItem('previousAssessment') || '{}');
              onComplete(prev.hasConcerns, prev.concerns);
            } else {
              setHasPreviewAssessment(false); // Show new assessment form
            }
          }}
          disabled={usePreviousAssessment === null}
          className="bg-yellow-400 text-black px-6 py-2 rounded-full hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-8">
      <h2 className="text-xl font-bold mb-6">Pre-Assessment</h2>
      
      <div className="mb-6">
        <p>Is there something bothering you?</p>
        <div className="space-y-2 mt-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={hasConcerns === true}
              onChange={() => setHasConcerns(true)}
              className="form-radio"
            />
            <span>Yes</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={hasConcerns === false}
              onChange={() => setHasConcerns(false)}
              className="form-radio"
            />
            <span>No</span>
          </label>
        </div>
      </div>

      {hasConcerns && (
        <div className="mb-6">
          <textarea
            value={concerns}
            onChange={(e) => setConcerns(e.target.value)}
            placeholder="Enter here"
            className="w-full h-32 p-3 border rounded-lg resize-none"
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={hasConcerns === null}
        className="bg-yellow-400 text-black px-6 py-2 rounded-full hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Submit
      </button>
    </div>
  );
};

export default PreAssessment;
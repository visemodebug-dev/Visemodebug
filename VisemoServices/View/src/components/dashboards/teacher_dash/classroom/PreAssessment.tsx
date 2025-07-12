import React, { useState, useEffect } from 'react';
import { submitPreAssessment } from '../../../../api/classroomApi';

interface PreAssessmentProps {
  onComplete: (hasConcerns: boolean, reasons?: string) => void;
  activityId: string | number;
}

const PreAssessment: React.FC<PreAssessmentProps> = ({ onComplete, activityId }) => { 
  const [hasConcerns, setHasConcerns] = useState<boolean | null>(null);
  const [reasons, setReasons] = useState('');
  const [hasPreviewAssessment, setHasPreviewAssessment] = useState(false);
  const [usePreviousAssessment, setUsePreviousAssessment] = useState<boolean | null>(null);

  useEffect(() => {
    const previousAssessment = localStorage.getItem('previousAssessment');
    if (previousAssessment) {
      setHasPreviewAssessment(true);
    }
  }, []);

    const handleSubmit = async () => {
    const userId = Number(localStorage.getItem('userId')); // assumes userId is saved at login

    if (!userId) {
      alert("User ID not found, please log in again.");
      return;
    }

    const finalHasConcerns = hasConcerns ?? false;

    try {
      await submitPreAssessment({
        activityId,
        hasConcerns: finalHasConcerns,
        reasons
      });

      // optionally save to localStorage
      localStorage.setItem('previousAssessment', JSON.stringify({
        hasConcerns: finalHasConcerns,
        reasons,
        timestamp: new Date().toISOString()
      }));

      onComplete(finalHasConcerns, reasons);
    } catch (err) {
      console.error("Failed to submit pre-assessment", err);
      alert("Failed to submit. Please try again.");
    }
  };


  if (hasPreviewAssessment && usePreviousAssessment === null) {
    return (
      <div className=" rounded-lg p-8">
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
                setReasons(prev.reasons);
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

       <button
          onClick={() => {
            if (usePreviousAssessment) {
              handleSubmit();
            } else {
              setHasPreviewAssessment(false);
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
            value={reasons}
            onChange={(e) => setReasons(e.target.value)}
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
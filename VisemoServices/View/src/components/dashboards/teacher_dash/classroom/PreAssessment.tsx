import React, { useState } from 'react';
import { submitPreAssessment } from '../../../../api/classroomApi';

interface PreAssessmentProps {
  onComplete: (hasConcerns: boolean, reasons?: string) => void;
  activityId: string | number;
}

const PreAssessment: React.FC<PreAssessmentProps> = ({ onComplete, activityId }) => {
  const [hasConcerns, setHasConcerns] = useState<boolean | null>(null);
  const [reasons, setReasons] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
  const finalHasConcerns = hasConcerns ?? false;

  try {
    setSubmitting(true);

    await submitPreAssessment({
      activityId,
      hasConcerns: finalHasConcerns,
      reasons,
    });

    onComplete(finalHasConcerns, reasons);
  } catch (err) {
    console.error("Failed to submit pre-assessment", err);
    alert("Failed to submit. Please try again.");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="rounded-lg p-8">
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
            placeholder="Please explain your concerns"
            className="w-full h-32 p-3 border rounded-lg resize-none"
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={hasConcerns === null || submitting}
        className="bg-yellow-400 text-black px-6 py-2 rounded-full hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting…' : 'Submit'}
      </button>
    </div>
  );
};

export default PreAssessment;

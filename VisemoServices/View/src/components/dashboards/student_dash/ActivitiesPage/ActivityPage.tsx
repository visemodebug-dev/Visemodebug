// src/components/dashboards/student_dash/ActivityPage/ActivityPage.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import CameraAccess from './CameraAccess';
import PreAssessment from './PreAssessment';
import CodeEditor from './CodeEditor';

type ActivityStep = 'camera' | 'assessment' | 'editor';

interface CapturedImage {
  data: string;
  timestamp: string;
}

// Add ImageViewer component
const ImageViewer: React.FC<{
  images: CapturedImage[];
  onClose: () => void;
}> = ({ images, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Captured Images ({images.length})</h3>
        <button 
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 text-2xl"
        >
          ×
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {images.map((img, index) => (
          <div key={index} className="border rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Capture {index + 1}</span>
              <span className="text-sm text-gray-500">{img.timestamp}</span>
            </div>
            <img 
              src={img.data} 
              alt={`Capture ${index + 1}`}
              className="w-full rounded"
            />
          </div>
        ))}
        {images.length === 0 && (
          <p className="text-center text-gray-500 col-span-2">No images captured yet</p>
        )}
      </div>
    </div>
  </div>
);

const ActivityPage: React.FC = () => {
  const { activityId } = useParams();
  const [currentStep, setCurrentStep] = useState<ActivityStep>('camera');
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleCameraReady = (cameraStream: MediaStream) => {
    setStream(cameraStream);
    setCurrentStep('assessment');
  };

  const startCapturing = () => {
    setIsCapturing(true);
  };

  const handlePreAssessmentComplete = (hasConcerns: boolean, concerns?: string) => {
    console.log('Pre-assessment results:', { hasConcerns, concerns });
    setCurrentStep('editor');
    startCapturing();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {currentStep === 'camera' && (
        <CameraAccess 
          onCameraReady={handleCameraReady}
        />
      )}

      {currentStep === 'assessment' && (
        <PreAssessment 
          onComplete={handlePreAssessmentComplete}
          activityId={activityId || ''}
        />
      )}

      {currentStep === 'editor' && (
        <CodeEditor 
          activityId={activityId}
          isCapturing={isCapturing}
          stream={stream}
          onSnapshot={(imageData) => {
            const newCapture = {
              data: imageData,
              timestamp: new Date().toLocaleTimeString()
            };
            setCapturedImages(prev => [...prev, newCapture]);
          }}
          capturedImages={capturedImages}
          onViewImages={() => setShowImageViewer(true)}
        />
      )}

      {showImageViewer && (
        <ImageViewer 
          images={capturedImages}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </div>
  );
};

export default ActivityPage;
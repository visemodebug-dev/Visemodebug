import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CameraProvider } from './components/dashboards/student_dash/CameraContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
  <CameraProvider>
    <App />
  </CameraProvider>
</React.StrictMode>
);

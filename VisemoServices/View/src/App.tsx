import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import VisemoLanding from './components/VisemoLanding';
import './index.css';
import TeacherSignUp from './components/loginauth/TeacherSignup';
import TeacherLogin from './components/loginauth/TeacherLogin';
import StudentSignUp from './components/loginauth/StudentSignup';
import StudentLogin from './components/loginauth/StudentLogin';
import AdminLogin from './components/loginauth/AdminLogin';
import AdminSignUp from './components/loginauth/AdminSignup';
import ForgotPassword from './components/loginauth/ForgotPassword';
import SetNewPassword from './components/loginauth/SetNewPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VisemoLanding />} />
        <Route path='/loginauth/teacher/login' element={<TeacherLogin/>}/>
        <Route path='/loginauth/teacher/signup' element={<TeacherSignUp/>} /> 
        <Route path='/loginauth/student/login' element={<StudentLogin/>}/>
        <Route path='/loginauth/student/signup' element={<StudentSignUp/>} />
        <Route path='/loginauth/admin/login' element={<AdminLogin/>}/>
        <Route path='/loginauth/admin/signup' element={<AdminSignUp/>}/>
        <Route path='/loginauth/student/*' element={<Navigate to="/loginauth/student/login" />} />
        <Route path='/loginauth/teacher/*' element={<Navigate to="/loginauth/teacher/login" />} />
        <Route path='/loginauth/admin/*' element={<Navigate to="/loginauth/admin/login" />} />
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/set-new-password' element={<SetNewPassword/>}/>
      </Routes>
    </Router>
  );
}

export default App;
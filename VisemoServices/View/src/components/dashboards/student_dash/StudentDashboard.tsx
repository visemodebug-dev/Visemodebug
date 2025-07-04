"use client";
import * as React from "react";
import { Routes, Route } from 'react-router-dom';
import ClassList from "./ClassList";
import ClassDetails from "./ClassDetails";

function StudentDashboard() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<ClassList />} />
        <Route path=":id" element={<ClassDetails />} />
      </Routes>
    </div>
  );
}

export default StudentDashboard;
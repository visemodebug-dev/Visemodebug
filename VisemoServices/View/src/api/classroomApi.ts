import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7131/api/Classroom";

const API = axios.create({
  baseURL: BASE_URL,
});

// Create Classroom
export const createClassroom = async (className: string) => {
  const response = await API.post("/CreateClassroom", { name: className });
  return response.data;
};

// Get All Classrooms
export const getClassrooms = async () => {
  const response = await API.get("/GetAllClassrooms");
  return response.data;
};

// Delete Classroom
export const deleteClassroom = async (id: string) => {
  const response = await API.delete(`/DeleteClassroom`);
  return response.data;
};
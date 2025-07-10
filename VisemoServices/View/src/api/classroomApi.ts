import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7131/api";

const API = axios.create({
  baseURL: BASE_URL,
});

// // Create Classroom
export const createClassroom = async (className: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in first.");

  return API.post(
    `/classroom/CreateClassroom`,
    { name: className },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


// Get All Classrooms
export const getClassrooms = async () => {
  const response = await API.get("/classroom/GetAllClassrooms");
  return response.data;
};

// Delete Classroom
export const deleteClassroom = async (id: number) => {
  const response = await API.delete(`/classroom/DeleteClassroom/`, {
    params: {id}
  });
  return response.data;
};

// Create Activity
export const createActivity = async (
  classroomId: number,
  name: string,
  timer: string,
  instruction: string
) => {
  const payload = {
    classroomId,
    name,
    timer,
    instruction
  };

  console.log("Sending payload:", payload);

  return axios.post(`${BASE_URL}/Activity/CreateActivity`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};


// Get Activities
export const getActivities = async (classroomId: number) => {
  const response = await API.get(`/Activity/GetActivities`, {
    params: { classroomId },
  });
  return response.data;
};

export const startActivity = (activityId: number) =>
  API.post(`/Activity/StartActivity`, null, {
    params: { activityId },
  });

  export const stopActivity = (activityId: number) =>
  API.post(`/Activity/StopActivity`,null,{
    params: { activityId },
  });

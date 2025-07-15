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

export const getActivityById = async (activityId: number) => {
  const response = await API.get(`/Activity/GetActivityById`, {
    params: { activityId },
  });
  return response.data;
}

export const startActivity = (activityId: number) =>
  API.post(`/Activity/StartActivity`, null, {
    params: { activityId },
  });

  export const stopActivity = (activityId: number) =>
  API.post(`/Activity/StopActivity`,null,{
    params: { activityId },
  });

export const submitPreAssessment = async ({
  activityId,
  hasConcerns,
  reasons,
}: {
  activityId: number | string;
  hasConcerns: boolean;
  reasons: string;
}) => {
  const token = localStorage.getItem("token");
  const storedUserId = localStorage.getItem("userId");
  if (!token) {
    throw new Error("No token found — please log in again.");
  }

  if (!storedUserId) {
    throw new Error("No userId found — please log in again.");
  }

  const userId = Number(storedUserId);

  return API.post(
    `/Activity/SubmitSelfAssessment`,
    {
      userId: Number(userId),
      activityId,
      hasConcerns,
      reasons,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const submitBuild = async ({
  isSuccessful,
  userId,
  activityId,
}: {
  isSuccessful: boolean;
  userId: number;
  activityId: number;
}) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found — please log in again.");

  return API.post(
    `/Activity/SubmitBuild`,
    { isSuccessful, userId, activityId},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const submitPicture = async ({
  image,
  activityId,
  userId,
}: {
image: string,
activityId: number,
userId: number,
}) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No Token Found - Please log in again");

    const formData = new FormData();
  formData.append("activityId", activityId.toString());
  formData.append("userId", userId.toString());

   // Convert base64 to Blob explicitly with type
  const byteString = atob(image.split(',')[1]);
  const mimeString = image.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });

  formData.append("image", blob, "snapshot.jpg");

  return API.post(`/emotion/DetectEmotion`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

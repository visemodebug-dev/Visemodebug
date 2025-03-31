import axios from "axios";

// /**
//  * Sends a password reset request to the server.
//  * @param email - The user's email address.
//  * @param idNumber - The user's ID number.
//  * @returns A promise that resolves with the server's response.
//  */


export const submitAuthForm = async (formData: FormData) => {
    try {
        const response = await axios.post("", formData, {
            headers: {
                'Content-Type' : 'multipart/form-data'
            }
        });

        if (response.status === 200) {
            console.log("Form submitted successfully");
        } else {
            console.log ("Form submitted failed");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
    }
}


export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post("/login", {email,password});

        if (response.status === 200) {
            console.log("Login Successful");
        } else {
            console.log("Login Failed");
        }
    } catch (error) {
        console.error("Error logging in:",error)
    }
};

export const forgotPassword = async (email: string, idNumber: string) => {
    try {
        const response = await axios.post("/forgot-password", {email, idNumber});

        if (response.status === 200) {
            return {
                success: true,
                message: "Password reset link sent to your email.",
            };
        } else {
            return {
                success: false,
                message: "Failed to send password reset link. Please try again."
            }
        }
    } catch (error) {
        console.error("Error sending password reset link", error);
        return {
            success: false,
            message: "An error occured. Please try again.",
        };
    }
};

export const resetPassword = async (password: string, token: string) => {
    try {
      const response = await axios.post(`/reset-password`, {
        password,
        token, // Backend needs this token to verify identity
      });
  
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Password reset failed");
    }
  };
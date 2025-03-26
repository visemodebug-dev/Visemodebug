import React, { useState } from "react";
import { IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../services/authService";

const SetNewPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<{ newPassword?: string; confirmPassword?: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear errors when user starts typing
    setError((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let validationErrors: { newPassword?: string; confirmPassword?: string } = {};

    if (!token) {
      setError({ newPassword: "Invalid or missing token." });
      return;
    }

    if (!formData.newPassword) {
      validationErrors.newPassword = "New password is required.";
    }

    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = "Confirm password is required.";
    } else if (formData.newPassword !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      await resetPassword(formData.newPassword, token);
      setSuccessMessage("Password reset successfully! Redirecting to login...");
      setError({});

      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setError({ newPassword: "Failed to reset password. Please try again." });
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex flex-col items-center justify-center px-16 bg-white">
        <h1 className="text-3xl font-bold text-center mb-3">VISEMO</h1>
        <h2 className="text-2xl font-semibold mt-2 text-center">Set New Password</h2>
        <p className="text-center text-gray-600 mt-2">Enter a new password to reset your account.</p>

        <form onSubmit={handleSubmit} className="w-full max-w-md mt-4">
          {/* New Password Field */}
          <div className="relative mt-5">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="input-style w-full pr-10"
            />
            <div className="absolute inset-y-0 right-0 pr-1 flex items-center">
              <IconButton onClick={togglePasswordVisibility} className="absolute right-2 top-1/2 transform -translate-y-1/2">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="relative mt-5">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="input-style w-full pr-10"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <IconButton onClick={toggleConfirmPasswordVisibility} className="absolute right-0 top-1/2 transform -translate-y-1/2">
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>
            {error.confirmPassword && <p className="text-red-500 text-sm mt-2">{error.confirmPassword}</p>}
          </div>

          {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}

          <button type="submit" className="bg-green-600 text-white py-2 px-4 w-full rounded-md mt-4">
            Set Password
          </button>
        </form>
      </div>

      <div className="w-1/2 flex items-center justify-center bg-green-500">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/803f8b24bebdf1cc6b90296d6924edb95e94cab9"
          alt="Set New Password Illustration"
          className="w-2/3"
        />
      </div>
    </div>
  );
};

export default SetNewPassword;

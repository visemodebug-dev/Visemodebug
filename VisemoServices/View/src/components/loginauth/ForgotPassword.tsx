import React, { useState } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authService";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !idNumber) {
      setError("Both Email and ID Number are required.");
      return;
    }
      const result = await forgotPassword(email,idNumber);

      if (result.success) {
        setSuccessMessage(result.message);
        setError("");
      } else {
        setError(result.message);
        setSuccessMessage("");
      }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex flex-col items-center justify-center px-16 bg-white">
        <div className="absolute top-4 left-4">
          <IconButton onClick={() => navigate("/")}>
            <ArrowBackIcon />
          </IconButton>
        </div>
        <h1 className="text-3xl font-bold text-center mb-3">VISEMO</h1>
        <h2 className="text-2xl font-semibold mt-2 text-center">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Enter your email address and ID Number to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-md mt-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-style mt-5 w-full"
          />
          <input 
            type="text"
            name="idNumber"
            placeholder="ID Number"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            required
            className="input-style mt-5 w-full"
           />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-sm mt-2">{successMessage}</p>
          )}

          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 w-full rounded-md mt-4"
          >
            Send Reset Link
          </button>
        </form>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex items-center justify-center bg-green-500 cursor-pointer"
        onClick={() => navigate("/set-new-password")}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/803f8b24bebdf1cc6b90296d6924edb95e94cab9"
          alt="Forgot Password Illustration"
          className="w-2/3"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
import React, { useState } from "react";
import { IconButton } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { login, submitAuthForm } from "../../services/authService";

interface AuthFormProps {
  type: "login" | "signup";
  role: "Student" | "Teacher" | "Admin";
}

const AuthForm: React.FC<AuthFormProps> = ({ type, role }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleInitial: "",
    email: "",
    idNumber: "",
    password: "",
    confirmPassword: "",
    idImage: null as File | null,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    idNumber: "",
    password: "",
    confirmPassword: "",
    idImage: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [idImage, setIdImage] = useState<File | null>(null);
  const [idImageName, setIdImageName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const roleImages: Record<string, Record<string,string>> = {
    Student: {
      login:  "https://cdn.builder.io/api/v1/image/assets/TEMP/c4398f704c288aaee98d97e7dbf910a6a79dad28",
      signup: "https://cdn.builder.io/api/v1/image/assets/TEMP/3ed37bfbc7442acd53a8035d94760c5e75b9ca94",
    },
    Teacher: {
      login: "https://cdn.builder.io/api/v1/image/assets/TEMP/97ac33657fa7044fa2cbf542d66251fd44ac1060",
      signup: "https://cdn.builder.io/api/v1/image/assets/TEMP/2935d2db3c636340ed9447ae7f4e92782374777a",
    },
    Admin: {
      login: "https://cdn.builder.io/api/v1/image/assets/TEMP/295b783d99dde77bcacee296a1896c97302f1fb2",
      signup: "https://cdn.builder.io/api/v1/image/assets/TEMP/2556eeb27628d593bb03ca1dbbde7909d0f13c37",
    },
  }

  const navigate = useNavigate();

  const selectedImage = roleImages[role]?.[type] || "/images/default.png";

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    return password === confirmPassword ? "" : "Passwords do not match";
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(formData.password, value),
      }));
    }
  };

  const handleIdImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdImage(e.target.files[0]);
      setIdImageName(e.target.files[0].name);
      setErrors((prev) => ({ ...prev, idImage: ""}))
    }
  };

  const handleRemoveImage = () => {
    setIdImage(null);
    setIdImageName("");
  };

  // Handle Submit Sign Up making HTTP request  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "signup") {
      if (!idImage) {
        setErrors((prev) => ({ ...prev, idImage: "ID is required." }));
        return;
      }

      if (!errors.password && !errors.confirmPassword) {
        console.log(`${type} form submitted for ${role}:`, formData);
      } else {
        console.log("Please fix the errors before submitting.");
      }

      if (!errors.password && !errors.confirmPassword) {
        const formDataToSend = new FormData();
        formDataToSend.append("firstName", formData.firstName);
        formDataToSend.append("lastName", formData.lastName);
        formDataToSend.append("middleInitial", formData.middleInitial);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("idNumber", formData.idNumber);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("confirmPassword", formData.confirmPassword);
        formDataToSend.append("idImage", idImage as File);

        await submitAuthForm(formDataToSend); // Use the service function
      } else {
        console.log("Please fix the errors before submitting.");
      }
    } else if (type === "login") {
      if (!errors.password) {
        console.log(`${type} form submitted for ${role}:`, formData);
        try {
          const res = await login(formData.email, formData.password);
          console.log("Login successful:", res);

        
          if (role === "Student") {
          navigate("/student-dashboard");
        } else if (role === "Teacher") {
          navigate("/teacher-dashboard");
        } else if (role === "Admin") {
          navigate("/admin-dashboard");
        }  // Use the login service function
      } catch (error) {
        console.log("Login failed:", error);
        alert("Login failed. Please check your credentials.");
      }
    }
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
          {type === "login" ? `Welcome back, ${role}!` : `Sign Up as ${role}!`}
        </h2>

        <form onSubmit={handleSubmit} className="w-full max-w-md mt-4">
          {type === "signup" && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="input-style"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="input-style"
                />
                <input
                  type="text"
                  name="middleInitial"
                  placeholder="M.I"
                  value={formData.middleInitial}
                  onChange={handleChange}
                  className="input-style text-start"
                />
              </div>
              <input
                type="text"
                name="idNumber"
                placeholder="ID Number"
                value={formData.idNumber}
                onChange={handleChange}
                required
                className="input-style mt-5"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-style mt-5 w-full"
          />

          {/* Password Fields */}
          <div className="relative mt-5">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-style w-full pr-10"
            />
            <div className="absolute inset-y-0 right-0 pr-1 flex items-center">
            <IconButton onClick={togglePasswordVisibility} className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
            </div>
            {errors.password && <p className="absolute text-red-500 text-sm">{errors.password}</p>}
          </div>

          {type === "signup" && (
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
              {errors.confirmPassword && <p className="absolute text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
          )}

          {type === "signup" && (
            <div className="mt-7 relative">
            {idImage ? (
              <div className="relative">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img
                      src={idImage ? URL.createObjectURL(idImage) : ""}
                      alt="ID Preview"
                      className="w-16 h-16 object-cover rounded mr-2 cursor-pointer"
                      onClick={() => setIsModalOpen(true)}
                    />
                    <div className="text-sm text-gray-600">{idImageName}</div>
                  </div>
                  <IconButton onClick={handleRemoveImage}>
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>
            ) : (
              <>
                <input
                  id="id-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleIdImageChange}
                />
                <label
                  htmlFor="id-image"
                  className="mt-8 text-sm text-center font-medium text-black focus:outline-none focus:ring-orange-500 focus:ring-opacity-80 cursor-pointer rounded-md bg-orange-500 py-2 px-4 hover:bg-orange-400 focus:ring-offset-2 focus:ring"
                >
                  Upload ID
                </label>
                {errors.idImage && <p className="text-red-500 text-sm mt-2">{errors.idImage}</p>}
              </>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-lg">
                  <img
                    src={idImage ? URL.createObjectURL(idImage) : ""}
                    alt="Full Preview"
                    className="w-80 h-auto object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
          )}

          {type === "login" ? (
          <div className="flex justify-end">
            <button onClick={() => navigate("/forgot-password")}
            className="mt-4 text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
            </div>
          ) : null}

          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 w-full rounded-md mt-4"
          >
            {type === "login" ? "Log In" : "Create Account"}
          </button>
        </form>
      </div>

      {/* Right Side */}
      <div className={`w-1/2 flex items-center justify-center ${type === "login" ? "bg-green-500" : "bg-yellow-400"}`}>
        <button onClick={() => navigate(type === "signup" ? `/loginauth/${role.toLowerCase()}/login` : `/loginauth/${role.toLowerCase()}/signup`)} className="cursor-pointer">
          <img src={selectedImage} alt={`${role} ${type}`} />
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
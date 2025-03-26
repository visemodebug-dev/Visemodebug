import AuthForm from "./AuthForm";
import React from "react";

const StudentLogin: React.FC = () => {
    return <AuthForm type="login" role="Student" />;
};

export default StudentLogin;
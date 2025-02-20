import React from "react";
import { Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

function TeacherPrivateRouter({ children }) {
  const auth = window.localStorage.getItem("token");
  return auth ? children : <Navigate to="/login" />;
}
export default TeacherPrivateRouter;

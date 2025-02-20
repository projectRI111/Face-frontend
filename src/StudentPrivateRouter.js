import React from "react";
import { Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

function StudentPrivateRouter({ children }) {
  const auth = window.localStorage.getItem("studentToken");
  return auth ? children : <Navigate to="/login" />;
}
export default StudentPrivateRouter;

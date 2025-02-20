import React, { Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Home from "./Pages/Home";
import RegisterPage from "./Pages/Register";

import LoginPage from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Overview from "./Pages/Overview";
import Attendance from "./Pages/Attendance";
import ReportsPage from "./Pages/Reports";
import CoursesPage from "./Pages/Courses";
import SettingsPage from "./Pages/Settings";
import StudentDashboard from "./Pages/StudentDasboard";
import StudentAttendance from "./Pages/StudentAttendance";
import StudentCourses from "./Pages/StudentCourses";
import StudentOverview from "./Pages/StudentOverview";
import StudentSettingsPage from "./Pages/StudentSettings";
import StudentPrivateRouter from "./StudentPrivateRouter";
import TeacherPrivateRouter from "./TeacherPrivateRouter";
import BarcodePage from "./Pages/BarCodePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          index
          element={
            <Suspense fallback={"....loading"}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={"...loading"}>
              <RegisterPage />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={"...loading"}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard"
          element={
            <TeacherPrivateRouter>
              <Dashboard />
            </TeacherPrivateRouter>
          }
        >
          {/* These are child routes for dashboard */}
          <Route path="overview" element={<Overview />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="qrcode" element={<BarcodePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route
          path="/student"
          element={
            <StudentPrivateRouter>
              <StudentDashboard />
            </StudentPrivateRouter>
          }
        >
          {/* These are child routes for dashboard */}
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="overview" element={<StudentOverview />} />
          <Route path="settings" element={<StudentSettingsPage />} />
          {/* <Route path="student-attendance" element={<Attendance />} />
          <Route path="qrcode" element={<QRCodePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="settings" element={<SettingsPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

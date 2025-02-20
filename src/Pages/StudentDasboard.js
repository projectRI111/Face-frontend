import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";

const DashboardIcon = ({ icon }) => <i className={`fas fa-${icon} text-lg`} />;

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();
     const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("student"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleSidebarToggle = () => setSidebarVisible(!sidebarVisible);

  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("student");
    navigate("/");
  };

  return (
    <div className="relative flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-t from-blue-500 to-green-500 p-4 transform transition-transform ease-in-out duration-300 ${
          sidebarVisible ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Portal</h2>
          <button
            onClick={handleSidebarToggle}
            className="text-3xl text-white md:hidden"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <nav className="mt-8">
          <ul>
            <li>
              <Link
                to="/student/overview"
                className="flex items-center px-3 py-3 text-white transition duration-200 rounded hover:bg-gray-700"
              >
                <DashboardIcon icon="home" />
                <span className="ml-3">Overview</span>
              </Link>
            </li>
            <li>
              <Link
                to="/student/attendance"
                className="flex items-center px-3 py-3 text-white transition duration-200 rounded hover:bg-gray-700"
              >
                <DashboardIcon icon="calendar-check" />
                <span className="ml-3">Attendance</span>
              </Link>
            </li>
            <li>
              <Link
                to="/student/courses"
                className="flex items-center px-3 py-3 text-white transition duration-200 rounded px03 hover:bg-gray-700"
              >
                <DashboardIcon icon="book" />
                <span className="ml-3">Courses</span>
              </Link>
            </li>
            <li>
              <Link
                to="/student/settings"
                className="flex items-center px-3 py-3 text-white transition duration-200 rounded hover:bg-gray-700"
              >
                <DashboardIcon icon="cogs" />
                <span className="ml-3">Settings</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-3 text-white transition duration-200 rounded hover:bg-gray-700"
              >
                <DashboardIcon icon="sign-out-alt" />
                <span className="ml-3">Log Out</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 md:ml-64">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 bg-white shadow-md">
          <button
            onClick={handleSidebarToggle}
            className="text-2xl text-blue-600 md:hidden"
          >
            <i className="fas fa-bars"></i>
          </button>
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-700">
              Welcome, {user?.firstName || "Student"}
            </span>
            <div className="flex items-center ml-4 space-x-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="object-cover w-10 h-10 rounded-full"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="w-10 h-10 text-gray-400"
                />
              )}
              <span className="text-sm text-gray-600">
                ID: {user?.uniqueId || "N/A"}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="px-6 pt-20">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="py-4 mt-8 text-center bg-white shadow-md">
          <p className="text-sm text-gray-600">
            © 2024 Benin University Portal | All Rights Reserved
          </p>
        </footer>
      </div>
    </div>
  );
};

export default StudentDashboard;

import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

// Placeholder icons (replace with real icons or SVGs as needed)
const Icon = ({ name }) => <i className={`fas fa-${name} text-xl`} />;

const Dashboard = () => {
  const navigate = useNavigate(); // Hook to handle redirection

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("teacher"); // Remove user data from localStorage

    // Redirect to home page
    navigate("/"); // Navigates to home page
  };

  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("teacher"));
    if (storedUser) {
      setUser(storedUser); // Set the user state
    }
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex w-full min-h-screen bg-white-100">
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-t from-blue-500 to-green-500 text-white fixed top-0 left-0 h-full transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 md:w-72 shadow-lg z-50`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={toggleSidebar}
            className="text-2xl text-white md:hidden"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <Link
                to="/dashboard/overview"
                className="flex items-center px-6 py-3 transition duration-300 hover:bg-white hover:bg-opacity-10"
              >
                <Icon name="home" />
                <span className="ml-4">Overview</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/attendance"
                className="flex items-center px-6 py-3 transition duration-300 hover:bg-white hover:bg-opacity-10"
              >
                <Icon name="calendar-check" />
                <span className="ml-4">Attendance Records</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/qrcode"
                className="flex items-center px-6 py-3 transition duration-300 hover:bg-white hover:bg-opacity-10"
              >
                <Icon name="qrcode" />
                <span className="ml-4">Generate QR Code</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/reports"
                className="flex items-center px-6 py-3 transition duration-300 hover:bg-white hover:bg-opacity-10"
              >
                <Icon name="chart-line" />
                <span className="ml-4">Reports</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/courses"
                className="flex items-center px-6 py-3 transition duration-300 hover:bg-white hover:bg-opacity-10"
              >
                <Icon name="book" />
                <span className="ml-4">Courses & Classes</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/settings"
                className="flex items-center px-6 py-3 transition duration-300 hover:bg-white hover:bg-opacity-10"
              >
                <Icon name="cog" />
                <span className="ml-4">Settings</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout} // Handle the logout action
                className="flex items-center px-6 py-3 transition duration-300 hover:bg-white hover:bg-opacity-10"
              >
                <Icon name="sign-out-alt" />
                <span className="ml-4">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-72">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 ml-0 bg-white shadow-md md:ml-72">
          <button onClick={toggleSidebar} className="text-blue-600 md:hidden">
            <i className="text-2xl fas fa-bars"></i>
          </button>
          {/* Display the User's Name Dynamically */}
          <Link
            to="/"
            className="flex items-center text-2xl font-semibold text-white"
          >
            <img src="/images/logo.png" alt="Logo" className="w-10 mr-2" />
          </Link>
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome, {user?.firstName || "Teacher"}
          </h2>
          <div className="flex items-center space-x-4">
            {/* Display Teacher ID Dynamically */}
            <p className="text-gray-700">
              Teacher ID: {user?.uniqueId || "N/A"}
            </p>
            {/* Profile Picture or Default Icon */}
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
          </div>
        </header>

        {/* Content Area */}
        <main className="px-4 pt-20 md:px-8">
          {/* Dynamically loading content via Outlet */}
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="py-4 mt-8 text-center bg-white shadow-md">
          <p className="text-gray-600">
            © 2024 Benin University Attendance System | All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;

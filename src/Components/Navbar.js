import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import Font Awesome Icon
import { faUserCircle } from "@fortawesome/free-solid-svg-icons"; // Import a user circle icon

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage when the component mounts
    const storedStudent = JSON.parse(localStorage.getItem("student"));
    const storedTeacher = JSON.parse(localStorage.getItem("teacher"));

    if (storedStudent) {
      setUser(storedStudent); // Set student info
    } else if (storedTeacher) {
      setUser(storedTeacher);
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full p-6 shadow-lg bg-gradient-to-r from-teal-500 to-blue-600">
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center text-2xl font-semibold text-white"
        >
          <img src="/images/logo.png" alt="Logo" className="w-10 mr-2" />
        </Link>

        {/* Menu items */}
        <div
          className={`hidden md:flex space-x-6 ${
            isMenuOpen ? "block" : "hidden"
          } md:block`}
        >
          <Link
            to="/"
            className="text-lg text-white transition duration-300 hover:text-gray-100"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-lg text-white transition duration-300 hover:text-gray-100"
          >
            About
          </Link>
          <Link
            to="/services"
            className="text-lg text-white transition duration-300 hover:text-gray-100"
          >
            Services
          </Link>
          <Link
            to="/contact"
            className="text-lg text-white transition duration-300 hover:text-gray-100"
          >
            Contact
          </Link>
        </div>

        {/* User/Auth */}
        <div className="items-center hidden space-x-4 md:flex">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-6 py-3 text-teal-600 transition duration-300 bg-white rounded-full hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 text-white transition duration-300 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-teal-600"
              >
                Register
              </Link>
            </>
          ) : (
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() =>
                user?.role === "teacher"
                  ? navigate("/dashboard/overview")
                  : navigate("/student/overview")
              }
            >
              {/* Font Awesome User Profile Icon */}
              <FontAwesomeIcon
                icon={faUserCircle}
                className="w-8 h-8 text-white"
              />
              {/* Display User Name */}
              <span className="font-semibold text-white">
                {user.firstName || "User"}
              </span>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-2xl text-white">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="p-6 space-y-6 text-center md:hidden bg-gradient-to-r from-teal-500 to-blue-600">
          <Link
            to="/"
            className="block text-lg text-white transition duration-300 hover:text-gray-100"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block text-lg text-white transition duration-300 hover:text-gray-100"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            to="/services"
            className="block text-lg text-white transition duration-300 hover:text-gray-100"
            onClick={toggleMenu}
          >
            Services
          </Link>
          <Link
            to="/contact"
            className="block text-lg text-white transition duration-300 hover:text-gray-100"
            onClick={toggleMenu}
          >
            Contact
          </Link>

          <div className="items-center space-x-4 md:flex">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-6 py-3 text-teal-600 transition duration-300 bg-white rounded-full hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 text-white transition duration-300 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-teal-600"
                >
                  Register
                </Link>
              </>
            ) : (
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() =>
                  user?.role === "teacher"
                    ? navigate("/dashboard/overview")
                    : navigate("/student/overview")
                }
              >
                {/* Font Awesome User Profile Icon */}
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="w-8 h-8 text-white"
                />
                {/* Display User Name */}
                <span className="font-semibold text-white">
                  {user.firstName || "User"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

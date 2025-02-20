import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ErrorBanner = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="fixed z-50 px-4 py-2 text-white transform -translate-x-1/2 bg-red-500 rounded shadow-lg top-4 left-1/2">
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          className="px-2 py-1 ml-4 text-white bg-red-700 rounded hover:bg-red-800"
          onClick={onDismiss}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState({});
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when the login request starts
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      console.log(response.data);
      setUser(response.data); // Store response data in state

      const { role, token } = response.data;

      // Store the token and user data in localStorage (using JSON.stringify to store objects)
      if (role === "student") {
        localStorage.removeItem("teacher");
        localStorage.removeItem("token");
        localStorage.setItem("studentToken", token); // Store token as student token
        localStorage.setItem("student", JSON.stringify(response.data)); // Store user data as string
        navigate("/student/overview"); // Navigate to student page
      } else if (role === "teacher") {
        localStorage.removeItem("student");
        localStorage.removeItem("studentToken");
        localStorage.setItem("token", token); // Store general token for teacher
        localStorage.setItem("teacher", JSON.stringify(response.data)); // Store user data as string
        navigate("/dashboard/overview"); // Navigate to teacher dashboard
      }
    } catch (error) {
      setError("Invalid credentials, please try again.");
      console.log(error);
    } finally {
      setIsLoading(false); // Set loading to false after request is complete
    }
  };

  const dismissError = () => {
    setError(""); // Dismiss the error by clearing the state
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-teal-500">
      <div className="w-full sm:w-96 lg:w-[600px] mt-5 mb-5">
        {/* Error Banner */}
        <ErrorBanner message={error} onDismiss={dismissError} />

        <div className="p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center text-2xl font-semibold text-white"
            >
              <img src="/images/logo.png" alt="Logo" className="w-10 mr-2" />
            </Link>
            <h2 className="mt-4 text-2xl font-semibold text-gray-700">Login</h2>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full p-2 text-white bg-yellow-400 rounded-md hover:bg-yellow-500"
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-500 hover:underline">
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

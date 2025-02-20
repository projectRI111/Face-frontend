import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import * as mpFaceDetection from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";

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

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [role, setRole] = useState("teacher");
  const [faceDetected, setFaceDetected] = useState(false); // Boolean to track face detection
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const videoRef = useRef(null);
  const cameraRef = useRef(null);
  const faceDetector = useRef(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  console.log(API_BASE_URL)

  // Initialize Mediapipe Face Detection and camera
  useEffect(() => {
    const initializeFaceDetection = async () => {
      try {
        faceDetector.current = new mpFaceDetection.FaceDetection({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
        });
        faceDetector.current.setOptions({
          model: "short", // Use the short-range model for close face detection
          minDetectionConfidence: 0.5,
        });

        faceDetector.current.onResults(onFaceDetectionResult);

        if (videoRef.current) {
          cameraRef.current = new Camera(videoRef.current, {
            onFrame: async () => {
              await faceDetector.current.send({ image: videoRef.current });
            },
            width: 640,
            height: 480,
          });
          cameraRef.current.start();
        }
      } catch (err) {
        console.error("Error initializing Mediapipe Face Detection:", err);
      }
    };
    initializeFaceDetection();

    // Cleanup camera and face detector
    return () => {
      if (cameraRef.current) cameraRef.current.stop();
    };
  }, []);

  // Handle face detection results
  const onFaceDetectionResult = (results) => {
    if (results.detections && results.detections.length > 0) {
      setFaceDetected(true);
    } else {
      setFaceDetected(false);
    }
  };

  // Fetch departments from the backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/department`);
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // For students, ensure a face is detected
    if (role === "student" && !faceDetected) {
      setError(
        "Face data is required for student registration. Please ensure your face is detected."
      );
      setIsLoading(false);
      return;
    }

    try {
      // Send registration data to the backend
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        firstName,
        lastName,
        email,
        password,
        role,
        departmentId,
      });
      navigate("/login");
    } catch (error) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-teal-500">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full sm:w-96 lg:w-[600px] mt-5 mb-5">
        <div className="text-center">
          <Link
            to="/"
            className="flex items-center text-2xl font-semibold text-white"
          >
            <img src="/images/logo.png" alt="Logo" className="w-10 mr-2" />
          </Link>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">
            Create Account
          </h2>
        </div>
        {error && (
          <ErrorBanner message={error} onDismiss={() => setError("")} />
        )}
        <form onSubmit={handleRegister} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
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
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="departmentId"
              className="block text-sm font-medium text-gray-700"
            >
              Department
            </label>
            <select
              id="departmentId"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              required
            >
              <option value="">Select Department</option>
              {departments.map((department) => (
                <option key={department._id} value={department._id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          {role === "student" && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Capture Your Face
              </label>
              {/* Video element to show the webcam feed */}
              <video
                ref={videoRef}
                autoPlay
                muted
                className="mb-2 bg-gray-200 rounded"
              />
              {faceDetected ? (
                <p className="mt-2 text-sm text-green-600">
                  Face detected successfully.
                </p>
              ) : (
                <p className="mt-2 text-sm text-red-600">
                  No face detected. Please ensure your face is visible.
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full p-2 text-white bg-yellow-400 rounded-md hover:bg-yellow-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 mr-2 border-t-2 border-white rounded-full animate-spin"></div>
                Registering...
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>
        <div className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-500 hover:underline hover:text-yellow-600"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

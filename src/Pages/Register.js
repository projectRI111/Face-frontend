import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";

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
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    departmentId: "",
    role: "teacher",
  });
  const [departments, setDepartments] = useState([]);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceData, setFaceData] = useState(null);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCamera, setShowCamera] = useState(true);
  const [retakeFace, setRetakeFace] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  console.log(faceDescriptor)

  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const MODEL_URL =
    "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights";

  // const models = [
  //   // { net: faceapi.nets.ssdMobilenetv1, name: "ssdMobilenetv1" },
  //   { net: faceapi.nets.tinyFaceDetector, name: "tinyFaceDetector" },
  //   // { net: faceapi.nets.faceLandmark68Net, name: "faceLandmark68Net" },
  //   // { net: faceapi.nets.faceRecognitionNet, name: "faceRecognitionNet" },
  //   // { net: faceapi.nets.faceExpressionNet, name: "faceExpressionNet" },
  // ];

  // async function loadModels() {
  //   console.log("Loading face recognition models...");
  //   for (const { net, name } of models) {
  //     try {
  //       await net.loadFromUri(MODEL_URL);
  //       console.log(`${name} loaded successfully`);
  //     } catch (e) {
  //       console.error(`Error loading ${name}`, e);
  //     }
  //   }
  //   console.log("All models loaded!");
  // }

  // loadModels();



  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
         faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Error loading face-api models:", err);
        setError("Failed to load face recognition models");
      }
    };
    loadModels();
  }, []);

  // Handle camera setup
  useEffect(() => {
    let isMounted = true;

    const setupCamera = async () => {
      if (!modelsLoaded) return;

      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        if (videoRef.current && (showCamera || retakeFace)) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          videoRef.current.srcObject = stream;
          streamRef.current = stream;

          // Start face detection
          videoRef.current.addEventListener("play", startFaceDetection);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError(
          "Failed to access camera. Please ensure camera permissions are granted."
        );
      }
    };

    if (formData.role === "student" && (showCamera || retakeFace)) {
      setupCamera();
    }

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showCamera, retakeFace, formData.role, modelsLoaded]);

  const startFaceDetection = async () => {
    if (!videoRef.current || !modelsLoaded) return;

    const detectFace = async () => {
      if (!videoRef.current || !showCamera) return;

      try {
        const detection = await faceapi
          .detectSingleFace(videoRef.current)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          setFaceDetected(true);
          // Wait a moment before capturing
          setTimeout(() => {
            if (showCamera) {
              captureFaceData(detection);
            }
          }, 1000);
        } else {
          setFaceDetected(false);
        }
      } catch (err) {
        console.error("Face detection error:", err);
      }

      if (showCamera) {
        requestAnimationFrame(detectFace);
      }
    };

    detectFace();
  };

  const captureFaceData = async (detection) => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    // Store both image and descriptor
    const faceImage = canvas.toDataURL("image/jpeg", 0.8);
    setFaceData(faceImage);
    setFaceDescriptor(Array.from(detection.descriptor));
    setShowCamera(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/department`);
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setError("Failed to load departments. Please refresh the page.");
      }
    };
    fetchDepartments();
  }, [API_BASE_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "role" && value === "student") {
      setShowCamera(true);
      setFaceData(null);
      setFaceDescriptor(null);
    }
  };

  const handleRetake = () => {
    setRetakeFace(true);
    setShowCamera(true);
    setFaceData(null);
    setFaceDescriptor(null);
    setFaceDetected(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.role === "student" && (!faceData || !faceDescriptor)) {
      setError("Face data is required for student registration.");
      setIsLoading(false);
      return;
    }

    try {
      const registrationData = {
        ...formData,
        faceData:
          formData.role === "student"
            ? {
                image: faceData,
                descriptors: faceDescriptor,
              }
            : null,
      };

      await axios.post(`${API_BASE_URL}/api/auth/register`, registrationData);
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // JSX remains mostly the same, just updated loading states
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-teal-500">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full sm:w-96 lg:w-[600px] mt-5 mb-5">
        <div className="text-center">
          <Link
            to="/"
            className="flex items-center justify-center text-2xl font-semibold text-gray-700"
          >
            <img src="/images/logo.png" alt="Logo" className="w-10 mr-2" />
            Register
          </Link>
        </div>

        {error && (
          <ErrorBanner message={error} onDismiss={() => setError("")} />
        )}

        <form onSubmit={handleRegister} className="mt-8 space-y-4">
          {/* Form fields */}
          {Object.entries({
            firstName: "First Name",
            lastName: "Last Name",
            email: "Email",
            password: "Password",
          }).map(([field, label]) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700"
              >
                {label}
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                id={field}
                name={field}
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData[field]}
                onChange={handleInputChange}
                required
              />
            </div>
          ))}

          {/* Role Selection */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* Department Selection */}
          <div>
            <label
              htmlFor="departmentId"
              className="block text-sm font-medium text-gray-700"
            >
              Department
            </label>
            <select
              id="departmentId"
              name="departmentId"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.departmentId}
              onChange={handleInputChange}
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

          {/* Face Detection Section */}
          {formData.role === "student" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Face Verification
              </label>

              {!modelsLoaded && (
                <p className="text-sm text-gray-600">
                  Loading face recognition models...
                </p>
              )}

              {showCamera && modelsLoaded && (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full bg-gray-200 rounded"
                  />
                  <div className="mt-2 text-sm text-center">
                    {faceDetected ? (
                      <p className="text-green-600">
                        Face detected! Capturing...
                      </p>
                    ) : (
                      <p className="text-gray-600">
                        Position your face in the camera
                      </p>
                    )}
                  </div>
                </div>
              )}

              {faceData && !showCamera && (
                <div className="space-y-2">
                  <p className="text-sm text-green-600">
                    Face data captured successfully!
                  </p>
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="w-full p-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Retake Photo
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-2 text-white bg-yellow-400 rounded-md hover:bg-yellow-500"
            disabled={
              isLoading || (formData.role === "student" && !modelsLoaded)
            }
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 mr-2 border-t-2 border-white rounded-full animate-spin" />
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

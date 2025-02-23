import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as faceapi from "face-api.js";

const BarcodePage = () => {
  const [courseId, setCourseId] = useState("");
  const [sessionIdentifier, setSessionIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceData, setFaceData] = useState(null);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [retakeFace, setRetakeFace] = useState(false);
  const [markAttendanceLoading, setMarkAttendanceLoading] = useState(false); // New loading state
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const MODEL_URL =
    "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token available");

        const response = await axios.get(
          `${API_BASE_URL}/api/courses/teacher`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourses(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch courses.");
      }
    };
    fetchCourses();
  }, []);

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

          videoRef.current.addEventListener("play", startFaceDetection);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError(
          "Failed to access camera. Please ensure camera permissions are granted."
        );
      }
    };

    if (showCamera || retakeFace) {
      setupCamera();
    }

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showCamera, retakeFace, modelsLoaded]);

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

    const faceImage = canvas.toDataURL("image/jpeg", 0.8);
    setFaceData(faceImage);
    setFaceDescriptor(Array.from(detection.descriptor));
    setShowCamera(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const handleRetake = () => {
    setRetakeFace(true);
    setShowCamera(true);
    setFaceData(null);
    setFaceDescriptor(null);
    setFaceDetected(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseId) {
      setError("Please select a course.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");

      const response = await axios.post(
        `${API_BASE_URL}/api/attendance/create/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setSessionIdentifier(response.data.session.sessionIdentifier);
        setShowCamera(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the session."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    setMarkAttendanceLoading(true); // Start loading
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");

      await axios.put(
        `${API_BASE_URL}/api/attendance/mark/${sessionIdentifier}`,
        {
          faceData: faceDescriptor,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Attendance Marked Successfully");
      setFaceData(null); //reset faceData after marking
      setShowCamera(true); //restart camera
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while marking attendance."
      );
    } finally {
      setMarkAttendanceLoading(false); // Stop loading
    }
  };

  const closeError = () => {
    setError("");
    setShowCamera(true);
    setFaceData(null);
    setFaceDescriptor(null);
    setFaceDetected(false);
  };

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-semibold text-gray-800">
          Attendance Page
        </h1>

        {error && (
          <div className="relative p-3 mb-6 text-white bg-red-500 rounded">
            <p>{error}</p>
            <button
              className="absolute text-white top-2 right-2"
              onClick={closeError}
            >
              &times;
            </button>
          </div>
        )}

        {!sessionIdentifier && (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="courseId"
                  className="block mb-2 text-lg font-semibold text-gray-700"
                >
                  Course:
                </label>
                <select
                  id="courseId"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  <option value="">Select a Course</option>
                  {courses?.map((course) => (
                    <option key={course._id} value={course?._id}>
                      {course?.name} ({course?.code})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 text-white transition duration-300 bg-purple-600 rounded-lg hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Attendance Session"}
              </button>
            </form>
          </div>
        )}

        {sessionIdentifier && !faceData && (
          <div className="mt-8 text-center">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Attendance Session Started!
            </h2>
            <p>Session Identifier: {sessionIdentifier}</p>

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

        {faceData && (
          <div className="mt-6 text-center">
            <button
              onClick={handleMarkAttendance}
              className="px-6 py-3 text-white transition duration-300 bg-green-600 rounded-lg hover:bg-green-700"
              disabled={markAttendanceLoading}
            >
              {markAttendanceLoading ? "Marking..." : "Mark Attendance"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarcodePage;

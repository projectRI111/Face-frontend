import React, { useState, useEffect } from "react";
import axios from "axios";

const Attendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_URL;

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
        setCourses(response.data); // Populate courses for the teacher
      } catch (err) {
        setError(err.message || "Failed to fetch courses.");
      }
    };
    fetchCourses();
  }, []);

  // Step 2: Fetch attendance history based on the selected courseId
  useEffect(() => {
    if (!selectedCourseId) return;

    const fetchAttendanceHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token available");

        const response = await axios.get(
          `${API_BASE_URL}/api/attendance/teacher/history/${selectedCourseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAttendanceData(response.data); // Populate attendance data
      } catch (err) {
        setError(err.message || "Failed to fetch attendance history.");
      }
    };

    fetchAttendanceHistory();
  }, [selectedCourseId]); // This effect runs when the selectedCourseId changes

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-semibold text-gray-800">
          Attendance History
        </h1>

        {/* Error message */}
        {error && (
          <div className="p-3 mb-6 text-white bg-red-500 rounded-md shadow-md">
            <p>{error}</p>
          </div>
        )}

        {/* Course Selection Section */}
        <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
          <label
            htmlFor="courseSelect"
            className="block mb-2 text-lg font-semibold text-gray-700"
          >
            Select Course:
          </label>
          <select
            id="courseSelect"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full p-4 transition duration-300 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">Select a Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name} ({course.code})
              </option>
            ))}
          </select>
        </div>

        {/* Attendance Data Table */}
        {attendanceData.length > 0 ? (
          <div className="overflow-hidden bg-white rounded-lg shadow-lg">
            <table className="min-w-full table-auto">
              <thead className="text-white bg-purple-600">
                <tr>
                  <th className="px-6 py-4 text-left">Student Name</th>
                  <th className="px-6 py-4 text-left">Attendance Status</th>
                  <th className="px-6 py-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((entry, index) => (
                  <tr key={index} className="border-t hover:bg-gray-100">
                    <td className="px-6 py-4">{entry.studentName}</td>
                    <td
                      className={`px-6 py-4 font-semibold ${
                        entry.status === "Present"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {entry.status}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(entry.lectureDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-6 text-center text-gray-700">
            No attendance data available.
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;

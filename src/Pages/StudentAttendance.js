import React, { useState, useEffect } from "react";
import axios from "axios";
import QrReader from "react-qr-scanner";

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

const MyAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [isScanning, setIsScanning] = useState(false); // QR scanning state
  const [sessionIdentifier, setSessionIdentifier] = useState(null); // Scanned session ID
  const [error, setError] = useState(""); // Error state\
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
       const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Fetch all courses for the student
  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("studentToken");
      if (!token) {
        setError("No student token available.");
        return;
      }

      setIsLoadingCourses(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/courses/student`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(response.data.courses);
      } catch (err) {
        setError("Failed to fetch courses. Please try again.");
        console.error("Error fetching courses:", err);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch attendance details for a selected course
  const fetchAttendanceDetails = async (course) => {
    const {
      _id: courseId,
      semesterStartDate,
      semesterDuration,
      schedule,
    } = course;

    const token = localStorage.getItem("studentToken");
    if (!token) {
      setError("No student token available.");
      return;
    }

    setIsLoadingAttendance(true);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/attendance/student/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Raw Response Data:", response.data);

      // Extract attended dates from the response
      const attendedDates = response.data?.attendanceList || [];
      console.log("Processed Attended Dates:", attendedDates);

      // Generate the full schedule for the semester
      const fullSchedule = generateDateRange(
        semesterStartDate,
        semesterDuration,
        schedule
      ).map((dateEntry) => {
        // Find matching attendance for the current date
        const matchedAttendance = attendedDates.find(
          (attendance) =>
            new Date(attendance.lectureDate).toISOString().split("T")[0] ===
            dateEntry.date
        );
        console.log("Generated Date Entry:", dateEntry);
        console.log("Matched Attendance:", matchedAttendance);

        // Check if the current session is within the timeframe
        const isWithinTimeframe = checkTimeframe(
          dateEntry.date,
          dateEntry.startTime,
          dateEntry.endTime
        );

        return {
          ...dateEntry,
          status: matchedAttendance
            ? matchedAttendance.status
            : new Date(dateEntry.date) > new Date()
            ? "Upcoming"
            : "Absent",
          isWithinTimeframe,
        };
      });

      console.log("Full Schedule with Attendance Status:", fullSchedule);

      setAttendanceDetails(fullSchedule);
      setSelectedCourse(course);
    } catch (err) {
      setError("Failed to fetch attendance details. Please try again.");
      console.error("Error fetching attendance details:", err);
    } finally {
      setIsLoadingAttendance(false);
    }
  };

  // Generate a range of dates for the semester based on schedule
  const generateDateRange = (startDate, durationMonths, schedule) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.toLocaleString("en-US", {
        weekday: "long",
      });
      const matchedSchedule = schedule.find((entry) => entry.day === dayOfWeek);

      if (matchedSchedule) {
        dates.push({
          date: currentDate.toISOString().split("T")[0], // Normalize to YYYY-MM-DD
          day: dayOfWeek,
          startTime: matchedSchedule.startTime,
          endTime: matchedSchedule.endTime,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log("Generated Date Range:", dates);
    return dates;
  };

  // Check if the current time is within a session's timeframe
  const checkTimeframe = (date, startTime, endTime) => {
    const now = new Date();
    const sessionStart = new Date(`${date}T${startTime}`);
    const sessionEnd = new Date(`${date}T${endTime}`);
    return now >= sessionStart && now <= sessionEnd;
  };

  const markAttendance = async (sessionIdentifier) => {
    console.log(sessionIdentifier)
    const token = localStorage.getItem("studentToken");
    if (!token) {
      setError("No student token available.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/attendance/mark/${sessionIdentifier}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Show success message
        setSuccessMessage("Attendance marked successfully!");

        // Optionally, you could refetch attendance details to ensure the UI reflects the backend state
        setTimeout(() => {
          fetchAttendanceDetails(selectedCourse);
          setSuccessMessage(""); // Clear success message after a delay
        }, 2000); // Delay for 2 seconds before refreshing the attendance list
      }
    } catch (err) {
      setError("Failed to mark attendance. Please try again.");
      console.error("Error marking attendance:", err);
    }
  };

  const handleScan = (data) => {
    console.log(data);
    if (data) {
      setSessionIdentifier(data?.text); // Extract session ID from QR
      setIsScanning(false); // Stop scanning

      // Directly mark attendance with the sessionIdentifier
      markAttendance(data?.text); // Pass sessionIdentifier directly
    }
  };

  const handleError = (err) => {
    console.error("Error scanning QR code:", err);
    setIsScanning(false);
  };

  return (
    <div className="relative min-h-screen p-4 bg-white-100">
      {/* Loading Overlay */}
      {(isLoadingCourses || isLoadingAttendance) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="w-16 h-16 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      )}

      {/* Error Banner */}
      <ErrorBanner message={error} onDismiss={() => setError("")} />
      {successMessage && (
        <div className="fixed z-50 px-4 py-2 text-white transform -translate-x-1/2 bg-green-500 rounded shadow-lg top-4 left-1/2">
          <div className="flex items-center justify-between">
            <span>{successMessage}</span>
            <button
              className="px-2 py-1 ml-4 text-white bg-green-700 rounded hover:bg-green-800"
              onClick={() => setSuccessMessage("")} // Dismiss the notification manually
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <h1 className="mb-6 text-2xl font-bold text-gray-800">My Attendance</h1>
      {/* QR Scanner */}
      {isScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-4 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Scan Attendance QR Code</h2>
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%" }}
            />
            <button
              className="px-4 py-2 mt-4 text-white bg-red-500 rounded"
              onClick={() => setIsScanning(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!selectedCourse ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course._id}
              className="p-4 transition bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-200"
              onClick={() => fetchAttendanceDetails(course)}
            >
              <h2 className="mb-2 text-xl font-semibold text-purple-600">
                {course.name}
              </h2>
              <p className="text-gray-700">Course Code: {course.code}</p>
              <p className="text-gray-600">
                Scheduled Days: {course.schedule.map((s) => s.day).join(", ")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 mb-6 overflow-x-auto bg-white rounded-lg shadow-md">
          <button
            className="mb-4 font-semibold text-purple-600"
            onClick={() => setSelectedCourse(null)}
          >
            &larr; Back to Courses
          </button>

          <h2 className="mb-4 text-xl font-semibold text-purple-600">
            {selectedCourse.name} ({selectedCourse.code})
          </h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b-2 border-gray-300">Date</th>
                <th className="px-4 py-2 border-b-2 border-gray-300">Day</th>
                <th className="px-4 py-2 border-b-2 border-gray-300">Time</th>
                <th className="px-4 py-2 border-b-2 border-gray-300">Status</th>
                <th className="px-4 py-2 border-b-2 border-gray-300">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody>
              {attendanceDetails.map((entry, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {entry.date}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {entry.day}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {entry.startTime} - {entry.endTime}
                  </td>
                  <td
                    className={`border-b border-gray-200 py-2 px-4 ${
                      entry.status === "present"
                        ? "text-green-600 font-bold"
                        : entry.status === "Absent"
                        ? "text-red-600 font-bold"
                        : entry.status === "Upcoming"
                        ? "text-blue-600 font-bold"
                        : ""
                    }`}
                  >
                    {entry.status}
                  </td>

                  <td className="px-4 py-2 border-b border-gray-200">
                    {entry.status === "pending" ? (
                      <input
                        type="checkbox"
                        onClick={() => setIsScanning(true)}
                        disabled={entry.isMarked}
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={entry.status === "present"}
                        disabled
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAttendance;

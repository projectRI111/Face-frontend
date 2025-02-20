import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Overview = () => {
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
     const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token available");

        const courseResponse = await axios.get(
          `${API_BASE_URL}/api/attendance/total-courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setTotalCourses(courseResponse.data.totalCourses);

        const attendanceResponse = await axios.get(
          "${API_BASE_URL}/api/attendance/attendance-summary",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setTotalAttendance(attendanceResponse.data.totalPresent);
        setTotalAbsent(attendanceResponse.data.totalAbsent);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ["Total Present", "Total Absent"],
    datasets: [
      {
        label: "Attendance Summary",
        data: [totalAttendance, totalAbsent],
        backgroundColor: ["#4CAF50", "#FF5252"],
        borderColor: ["#388E3C", "#D32F2F"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mx-auto">
        <h1 className="mb-6 text-3xl font-semibold text-gray-800">
          Dashboard Overview
        </h1>
        <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Total Attendance */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Total Attendance
            </h2>
            <p className="text-2xl font-bold text-purple-600">
              {totalAttendance}
            </p>
          </div>

          {/* Total Courses */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Total Courses
            </h2>
            <p className="text-2xl font-bold text-purple-600">{totalCourses}</p>
          </div>

          {/* Total Absentees */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Total Absent
            </h2>
            <p className="text-2xl font-bold text-red-600">{totalAbsent}</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="p-6 mt-5 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Attendance Trends
          </h2>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Overview;

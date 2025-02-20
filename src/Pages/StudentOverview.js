import React, { useState, useEffect } from "react";
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

const StudentOverview = () => {
  const [attendanceStats, setAttendanceStats] = useState({
    totalClasses: 0,
    totalPresent: 0,
    totalAbsent: 0,
  });
     const API_BASE_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const token = localStorage.getItem("studentToken");
        if (!token) throw new Error("Token not found.");

        const { data } = await axios.get(
          `${API_BASE_URL}/api/attendance/attendance-summary/student`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setAttendanceStats({
          totalClasses: data.totalClasses,
          totalPresent: data.totalPresent,
          totalAbsent: data.totalAbsent,
        });
      } catch (error) {
        console.error("Error fetching attendance data", error);
      }
    };

    fetchAttendanceData();
  }, []);

  const chartData = {
    labels: ["Present", "Absent", "Late"],
    datasets: [
      {
        label: "Attendance Summary",
        data: [attendanceStats.totalPresent, attendanceStats.totalAbsent],
        backgroundColor: ["#2ECC71", "#E74C3C", "#F39C12"],
        borderColor: ["#27AE60", "#C0392B", "#F39C12"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen py-8 bg-white-100 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-4xl font-semibold text-gray-800">
          Attendance Overview
        </h1>

        {/* Attendance Cards Section */}
        <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 text-center bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">
              Total Classes
            </h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {attendanceStats.totalClasses}
            </p>
          </div>

          <div className="p-6 text-center bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">
              Classes Attended
            </h3>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {attendanceStats.totalPresent}
            </p>
          </div>

          <div className="p-6 text-center bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">
              Classes Missed
            </h3>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {attendanceStats.totalAbsent}
            </p>
          </div>
        </div>

        {/* Attendance Chart Section */}
        <div className="p-6 mt-10 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800">
            Attendance Trends
          </h2>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                },
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;

import React, { useState, useEffect } from "react";
import axios from "axios";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from local storage
        if (!token) throw new Error("No token available");
        const response = await axios.get(`${API_BASE_URL}/api/courses/teacher`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setCourses(response.data);
      } catch (err) {
        setError("Failed to fetch courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Your Courses</h1>
        {loading ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 mb-4 ease-linear border-4 border-t-4 border-gray-200 rounded-full loader"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-white bg-red-500 rounded-lg">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course._id}
                className="p-5 transition-shadow duration-300 bg-white rounded-lg shadow-lg hover:shadow-2xl"
              >
                <h2 className="text-xl font-semibold text-gray-700">
                  {course.name}
                </h2>
                <p className="text-gray-600">Code: {course.code}</p>
                <p className="mt-2 text-gray-500">
                  Classes:
                  <ul className="mt-1 ml-5 list-disc">
                    {course.schedule.map((classItem) => (
                      <li key={classItem._id}>
                        {classItem.day}: {classItem.startTime} -{" "}
                        {classItem.endTime}
                      </li>
                    ))}
                  </ul>
                </p>
                <button className="w-full py-2 mt-4 text-white transition duration-300 bg-purple-600 rounded-lg hover:bg-purple-700">
                  Manage Course
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;

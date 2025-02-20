import React, { useState, useEffect } from "react";
import axios from "axios";

const SettingsPage = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
      const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token available");
        const response = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setUser(response.data);
      } catch (err) {
        setError("Failed to load user profile.");
      }
    };
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");

      const response = await axios.put(
        `${API_BASE_URL}/api/auth/profile`,
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 md:px-8">
      <div className="max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Settings</h1>

        {error && (
          <div className="p-3 mb-6 text-white bg-red-500 rounded">{error}</div>
        )}
        {success && (
          <div className="p-3 mb-6 text-white bg-green-500 rounded">
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className="w-full p-3 border rounded-lg"
              value={user.firstName || ""}
              onChange={handleInputChange}
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
              id="lastName"
              name="lastName"
              type="text"
              className="w-full p-3 border rounded-lg"
              value={user.lastName || ""}
              onChange={handleInputChange}
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
              id="email"
              name="email"
              type="email"
              className="w-full p-3 border rounded-lg"
              value={user.email || ""}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label
              htmlFor="uniqueId"
              className="block text-sm font-medium text-gray-700"
            >
              Unique ID
            </label>
            <input
              id="uniqueId"
              name="uniqueId"
              type="text"
              className="w-full p-3 border rounded-lg"
              value={user.uniqueId || ""}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700"
            >
              Department
            </label>
            <input
              id="department"
              name="department"
              type="text"
              className="w-full p-3 border rounded-lg"
              value={user.department?.name || ""}
              onChange={handleInputChange}
              disabled
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;

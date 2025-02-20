import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <nav className="flex flex-col space-y-4">
        <Link
          to="/dashboard/overview"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Overview
        </Link>
        <Link
          to="/dashboard/attendance"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Attendance
        </Link>
        <Link to="/dashboard/qr-code" className="hover:bg-gray-700 p-2 rounded">
          QR Code
        </Link>
        <Link to="/dashboard/reports" className="hover:bg-gray-700 p-2 rounded">
          Reports
        </Link>
        <Link
          to="/dashboard/settings"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Settings
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;

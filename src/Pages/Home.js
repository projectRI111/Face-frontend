import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <div className="pt-16">
        {/* Hero Section */}
        <section
          className="relative px-8 py-24 text-white bg-gradient-to-r from-blue-600 to-teal-500"
          style={{
            backgroundImage: `url('/images/hero.jpg')`, // New background image
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          {/* Content */}
          <div className="relative max-w-5xl mx-auto text-center">
            <h1 className="mb-4 text-5xl font-extrabold md:text-6xl">
              Transform Attendance Tracking With Face Recognition
            </h1>
            <p className="mb-8 text-lg md:text-xl">
              Streamline your classroom management with cutting-edge Face Recognition
              technology.
            </p>
            <Link
              to="/register"
              className="px-8 py-4 text-xl font-bold text-gray-900 transition duration-300 bg-yellow-400 rounded-full hover:bg-yellow-500"
            >
              Start Now
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-24 bg-gray-100">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="mb-16 text-4xl font-bold text-gray-800">
              Key Features of Our Attendance System
            </h2>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="p-8 transition duration-300 bg-white rounded-lg shadow-xl hover:shadow-2xl">
                <i className="mb-4 text-5xl text-teal-500 fas fa-qrcode"></i>
                <h3 className="mb-4 text-2xl font-semibold text-gray-800">
                  Face Attendance
                </h3>
                <p className="text-gray-600">
                  Simplify the attendance process with a quick QR scan for each
                  class session.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="p-8 transition duration-300 bg-white rounded-lg shadow-xl hover:shadow-2xl">
                <i className="mb-4 text-5xl text-teal-500 fas fa-sync-alt"></i>
                <h3 className="mb-4 text-2xl font-semibold text-gray-800">
                  Real-Time Monitoring
                </h3>
                <p className="text-gray-600">
                  Track attendance in real-time and ensure seamless classroom
                  management.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="p-8 transition duration-300 bg-white rounded-lg shadow-xl hover:shadow-2xl">
                <i className="mb-4 text-5xl text-teal-500 fas fa-clipboard-list"></i>
                <h3 className="mb-4 text-2xl font-semibold text-gray-800">
                  Attendance Reports
                </h3>
                <p className="text-gray-600">
                  Generate detailed reports and analytics to track attendance
                  trends over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="px-6 py-24 text-white bg-teal-600">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="mb-4 text-4xl font-bold">
              Ready to Revolutionize Attendance Tracking?
            </h2>
            <p className="mb-8 text-xl">
              Join the future of education with Benin University's innovative
              QR-based attendance system.
            </p>
            <Link
              to="/register"
              className="px-8 py-4 text-xl font-bold text-gray-900 transition duration-300 bg-yellow-400 rounded-full hover:bg-yellow-500"
            >
              Get Started Now
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;

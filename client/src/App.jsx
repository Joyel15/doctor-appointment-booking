import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import Layout from "./components/common/Layout.jsx";

// ---------- Public Pages ----------
import Home from "./pages/public/Home.jsx";
import Login from "./pages/public/Login.jsx";
import Register from "./pages/public/Register.jsx";
import Doctors from "./pages/public/Doctors.jsx";
import DoctorProfile from "./pages/public/DoctorProfile.jsx";
import Unauthorized from "./pages/public/Unauthorized.jsx";
import NotFound from "./pages/public/NotFound.jsx";
import Specializations from "./pages/public/Specializations.jsx";

// ---------- Patient Pages ----------
import PatientDashboard from "./pages/patient/Dashboard.jsx";
import MyAppointments from "./pages/patient/MyAppointments.jsx";
import BookAppointment from "./pages/patient/BookAppointment.jsx";
import ApplyDoctor from "./pages/patient/ApplyDoctor.jsx";
import MyReviews from "./pages/patient/MyReviews.jsx";
import PatientEditProfile from "./pages/patient/PatientEditProfile.jsx";

// ---------- Doctor Pages ----------
import DoctorDashboard from "./pages/doctor/Dashboard.jsx";
import ManageAppointments from "./pages/doctor/ManageAppointments.jsx";
import EditProfile from "./pages/doctor/EditProfile.jsx";

// ---------- Admin Pages ----------
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import PendingDoctors from "./pages/admin/PendingDoctors.jsx";
import AllUsers from "./pages/admin/AllUsers.jsx";

function App() {
  return (
    // Enables client-side routing
    <BrowserRouter>
      {/* Makes authentication state available throughout the app */}
      <AuthProvider>
        {/* Global toast notifications */}
        <Toaster position="top-center" richColors />

        <Routes>
          {/* ===================== PUBLIC ROUTES ===================== */}

          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />

          <Route
            path="/register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />

          <Route
            path="/doctors"
            element={
              <Layout>
                <Doctors />
              </Layout>
            }
          />

          <Route
            path="/doctors/:id"
            element={
              <Layout>
                <DoctorProfile />
              </Layout>
            }
          />

          <Route
            path="/unauthorized"
            element={
              <Layout>
                <Unauthorized />
              </Layout>
            }
          />

          <Route
            path="/specializations"
            element={
              <Layout>
                <Specializations />
              </Layout>
            }
          />

          {/* ===================== PATIENT ROUTES ===================== */}

          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute role="patient">
                <Layout>
                  <PatientDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute role="patient">
                <Layout>
                  <MyAppointments />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/book/:doctorId"
            element={
              <ProtectedRoute role="patient">
                <Layout>
                  <BookAppointment />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/apply-doctor"
            element={
              <ProtectedRoute role="patient">
                <Layout>
                  <ApplyDoctor />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/reviews"
            element={
              <ProtectedRoute role="patient">
                <Layout>
                  <MyReviews />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute role="patient">
                <Layout>
                <PatientEditProfile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ===================== DOCTOR ROUTES ===================== */}

          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute role="doctor">
                <Layout>
                  <DoctorDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute role="doctor">
                <Layout>
                  <ManageAppointments />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/profile"
            element={
              <ProtectedRoute role="doctor">
                <Layout>
                  <EditProfile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ===================== ADMIN ROUTES ===================== */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute role="admin">
                <Layout>
                  <PendingDoctors />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <Layout>
                  <AllUsers />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ===================== 404 PAGE ===================== */}

          <Route
            path="*"
            element={
              <Layout>
                <NotFound />
              </Layout>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

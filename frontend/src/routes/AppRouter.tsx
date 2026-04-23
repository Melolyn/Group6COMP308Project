import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Analytics from "../pages/Analytics";
import AdvocateDashboard from "../pages/AdvocateDashboard";
import Chatbot from "../pages/Chatbot";
import Home from "../pages/Home";
import IssueDetails from "../pages/IssueDetails";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import ReportIssue from "../pages/ReportIssue";
import ResidentDashboard from "../pages/ResidentDashboard";
import StaffDashboard from "../pages/StaffDashboard";
import UserIssues from "../pages/UserIssues";

type AppUserRole = "resident" | "staff" | "advocate";

type StoredUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AppUserRole;
};

function getCurrentUser(): StoredUser | null {
  const raw = localStorage.getItem("civicai_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function RoleDashboard() {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "staff") {
    return <StaffDashboard />;
  }

  if (user.role === "resident") {
    return <ResidentDashboard />;
  }

  if (user.role === "advocate") {
    return <AdvocateDashboard />;
  }

  return <Navigate to="/" replace />;
}

function StaffOnlyRoute({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "staff") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AdvocateOrStaffRoute({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "staff" && user.role !== "advocate") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportIssue />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-issues"
            element={
              <ProtectedRoute>
                <UserIssues />
              </ProtectedRoute>
            }
          />

          <Route
            path="/issue/:id"
            element={
              <ProtectedRoute>
                <IssueDetails />
              </ProtectedRoute>
            }
          />

          <Route path="/dashboard" element={<RoleDashboard />} />

          <Route
            path="/staff-dashboard"
            element={
              <StaffOnlyRoute>
                <StaffDashboard />
              </StaffOnlyRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <AdvocateOrStaffRoute>
                <Analytics />
              </AdvocateOrStaffRoute>
            }
          />

          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
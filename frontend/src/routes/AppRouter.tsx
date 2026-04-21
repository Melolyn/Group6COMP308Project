import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Analytics from "../pages/Analytics";
import Home from "../pages/Home";
import IssueDetails from "../pages/IssueDetails";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import ReportIssue from "../pages/ReportIssue";
import StaffDashboard from "../pages/StaffDashboard";
import UserIssues from "../pages/UserIssues";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/my-issues" element={<UserIssues />} />
          <Route path="/issue/:id" element={<IssueDetails />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./layouts/AppShell";
import Dashboard from "./pages/Dashboard";
import StartScan from "./pages/StartScan";
import ManualLookup from "./pages/ManualLookup";
import PatientFound from "./pages/PatientFound";
import Confirmed from "./pages/Confirmed";
import Duplicate from "./pages/Duplicate";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected app */}
        <Route element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }>
          <Route path="/" element={<Dashboard />} />
          <Route path="/checkin/start" element={<StartScan />} />
          <Route path="/checkin/lookup" element={<ManualLookup />} />
          <Route path="/checkin/found" element={<PatientFound />} />
          <Route path="/checkin/confirmed" element={<Confirmed />} />
          <Route path="/checkin/duplicate" element={<Duplicate />} />
          {/* add profile/appointment/reports protected pages here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/theme.css";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CheckAuth from "./components/check-auth.jsx";
import TicketsList from "./pages/TicketsList.jsx";
import TicketDetail from "./pages/TicketDetail.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import Admin from "./pages/admin.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import AppShell from "./layout/AppShell.jsx";
import { ToastProvider } from "./ui/Toast.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <CheckAuth protectedRoute={false}>
                <Login />
              </CheckAuth>
            }
          />
          <Route
            path="/signup"
            element={
              <CheckAuth protectedRoute={false}>
                <Signup />
              </CheckAuth>
            }
          />
          <Route
            path="/*"
            element={
              <CheckAuth protectedRoute={true}>
                <AppShell />
              </CheckAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tickets" element={<TicketsList />} />
            <Route path="tickets/:id" element={<TicketDetail />} />
            <Route path="admin" element={<Admin />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </StrictMode>
);

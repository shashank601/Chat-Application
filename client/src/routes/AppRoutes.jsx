import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home";
import ChatAppLayout from "../layouts/ChatAppLayout";
import ChatPanel from "../components/chatPanel/ChatPanel";
import RequireAuth from "../utils/RequireAuth";
import GuestRoute from "../utils/GuestRoute";
import { SocketProvider } from "../context/SocketContext";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      </Route>

      <Route
        path="/chat"
        element={
          <RequireAuth>
            <SocketProvider>
              <ChatAppLayout /> {/* This is the main layout with sidebar and outlet */}
            </SocketProvider>
          </RequireAuth>
        }
      >
        <Route index element={<Home />} />
        <Route path="room/:roomId" element={<ChatPanel />} />
      </Route>



      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import ChatAppLayout from "../layouts/ChatAppLayout.jsx";
import ChatPanel from "../containers/ChatPanel.jsx";
import RequireAuth from "../utils/RequireAuth.jsx";
import GuestRoute from "../utils/GuestRoute.jsx";
import { SocketProvider } from "../context/SocketContext.jsx";
import RequireRoomAccess from "../utils/RequireRoomAccess.jsx";

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
        <Route path=":type/:role/:displayName/:roomId" element={
          <RequireRoomAccess>
            <ChatPanel />
          </RequireRoomAccess>
        } />
      </Route>



      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
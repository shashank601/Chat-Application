import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getMyRooms } from "../services/RoomService";
import { useAuth } from "../context/AuthContext";

export default function RequireRoomAccess({ children }) {
  const { roomId } = useParams();
  const { user, loading } = useAuth();
  const [valid, setValid] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    const check = async () => {
      try {
        const body = await getMyRooms();
        const rooms = body?.data;
        const exists = Array.isArray(rooms)
          ? rooms.find((r) => String(r.room_id) === String(roomId))
          : null;

        setValid(Boolean(exists));
      } catch {
        setHasError(true);
      }
    };

    check();
  }, [roomId, loading, user]);

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (hasError) return <Navigate to="/chat" />;
  if (valid === false) return <Navigate to="/chat" />; // or 404
  if (valid === null) return null; // loading
  return children;
}
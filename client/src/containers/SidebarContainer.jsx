import { useState, useEffect, useCallback } from "react";
import { getMyRooms, createRoom } from "../services/RoomService.js";
import Searchbar from "../components/searchbar.jsx";
import SidebarItem from "../components/cards/SidebarItem.jsx";
import { mapRoom } from "../mapper/mapGetRoom.js";
import { useSocket } from "../context/SocketContext.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SidebarContainer() {
  // const [selectedRoomId, setSelectedRoomId] = useState(null);
  const { onReceiveMessage, onRoomCreated, onRoomDeleted } = useSocket();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id || "";

  const [rooms, setRooms] = useState([]);

  const fetchRooms = useCallback(() => {
    getMyRooms()
      .then((body) => {
        const roomsData = body?.data;
        if (Array.isArray(roomsData)) {
          setRooms(roomsData.map(mapRoom));
        } else {
          setRooms([]);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const messageHandler = (msg) => {
      setRooms((prevRooms) => {
        return prevRooms
          .map((room) =>
            room.room_id === msg.room_id ? { ...room, last_msg: msg } : room,
          )
          .sort((a, b) => {
            const aTime = a.last_msg?.created_at || 0;
            const bTime = b.last_msg?.created_at || 0;
            return bTime - aTime;
          });
      });
    };

    const remove = onReceiveMessage(messageHandler);
    return () => remove();
  }, [onReceiveMessage]);

  // refetch on room created notification
  useEffect(() => {
    const roomCreatedHandler = () => {
      fetchRooms();
    };

    const remove = onRoomCreated(roomCreatedHandler);
    return () => remove();
  }, [onRoomCreated, fetchRooms]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    const roomDeletedHandler = (room_id) => {
      setRooms((prevRooms) =>
        prevRooms.filter((room) => room.room_id !== room_id),
      );
    };

    const remove = onRoomDeleted(roomDeletedHandler);
    return () => remove();
  }, [onRoomDeleted]);

  return (
    <div className="flex flex-col min-h-screen ml-10 mr-4">
      <div className="h-1/5 sticky top-0 bg-slate-50 pb-3">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold pb-4">Live Chat</h1>
          <h1
            className="text-2xl font-bold pb-1 mb-2 fixed left-1 bottom-1 cursor-pointer border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100"
            onClick={async () => {
              await createRoom(null, "hi");
              fetchRooms();
            }}
          >
            +
          </h1>
        </div>
        <Searchbar />
      </div>

      <div className="flex-1 overflow-y-auto pt-4">
        {rooms.map((room) => (
          <SidebarItem
            key={room.room_id}
            room={room}
            onClick={() => {
              navigate(`/chat/${room.room_id}`);
            }}
          />
        ))}
      </div>
    </div>
  );
}

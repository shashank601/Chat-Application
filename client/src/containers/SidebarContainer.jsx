import { useState, useEffect, useCallback } from "react";
import { getMyRooms } from "../services/RoomService.js";
import Searchbar from "../components/searchbar.jsx";
import SidebarItem from "../components/cards/SidebarItem.jsx";
import { mapRoom } from "../mapper/mapGetRoom.js";
import { useSocket } from "../context/SocketContext.jsx";

export default function SidebarContainer() {
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const { onReceiveMessage, onRoomCreated, onRoomDeleted } = useSocket();

  const [rooms, setRooms] = useState([]);

  
  const fetchRooms = useCallback(() => {
    getMyRooms()
      .then((res) => {
        const response = res.data;
        if (Array.isArray(response)) {
          setRooms(response.map(mapRoom));
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
            room.room_id === msg.room_id
              ? { ...room, last_msg: msg }
              : room
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
      setRooms((prevRooms) => prevRooms.filter((room) => room.room_id !== room_id));
    };

    const remove = onRoomDeleted(roomDeletedHandler);
    return () => remove();
  }, [onRoomDeleted]);

  return (
    <div className="flex flex-col min-h-screen ml-10 mr-4">
      <div className="h-1/5 sticky top-0 bg-slate-50 pb-3">
        <h1 className="text-2xl font-bold pb-4">Live Chat</h1>
        <Searchbar />
      </div>

      <div className="flex-1 overflow-y-auto pt-4">
        {rooms.map((room) => (
          <SidebarItem key={room.room_id} room={room} />
        ))}
      </div>
    </div>
  );
}
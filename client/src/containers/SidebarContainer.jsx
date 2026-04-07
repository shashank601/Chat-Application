import { useState, useEffect } from "react";
import { getMyRooms } from "../services/RoomService.js";
import Searchbar from "../components/searchbar.jsx";
import SidebarItem from "../components/cards/SidebarItem.jsx";
import { mapRoom } from "../mapper/mapGetRoom.js";

export default function SidebarContainer() {
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  // [{ room_id, display_name, type, role, last_msg, last_msg_at }]
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
  
    getMyRooms()
      .then((res) => {

        const response = res.data;
        if (Array.isArray(response)) {
          const normalizedRooms = response.map(mapRoom);
          setRooms(normalizedRooms);
        } else {
          setRooms([]); // fallback if not array
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen ml-10 mr-4">
      <div className="h-1/5 sticky top-0  bg-slate-50 pb-3">
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

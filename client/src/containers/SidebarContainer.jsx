import { useState, useEffect } from "react";
import { getMyRooms } from "../services/RoomService.js";
import SidebarItem from "../components/cards/SidebarItem.jsx";
import { mapRoom } from "../mapper/mapGetRoom.js";
import Searchbar from "../components/searchbar.jsx";

export default function SidebarContainer() {
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  // [{ room_id, display_name, type, role, last_msg, last_msg_at }]
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    getMyRooms()
      .then((res) => {
        const roomsArray = res.data; 
        if (Array.isArray(roomsArray)) {
          const normalizedRooms = roomsArray.map(mapRoom);
          setRooms(normalizedRooms);
        } else {
          setRooms([]); // fallback if not array
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <div>
        <Searchbar />
      </div>
      <div>
        {rooms.map((room) => (
          <SidebarItem key={room.room_id} room={room} />
        ))}
      </div>
    </div>
  );
}

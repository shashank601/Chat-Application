import { useState, useEffect } from "react";
import { getMyRooms } from "../services/RoomService.js";
import { Sidebar } from "../components/sidebar/Sidebar.jsx";

export default function SidebarContainer() {
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    
    // [{ room_id, display_name, type, role, last_msg, last_msg_at }]
    const [rooms, setRooms] = useState([]);
    
    useEffect(() => {
        getMyRooms().then((rooms) => {
            setRooms(rooms);
        });
    }, []);
    
    return (
        <div>
            
        </div>
    )
}


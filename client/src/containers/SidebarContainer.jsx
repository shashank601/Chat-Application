import { useState, useEffect, useCallback } from "react";
import { getMyRooms, createRoom } from "../services/RoomService.js";
import Searchbar from "../components/Searchbar.jsx";
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
  //console.log(`User: ${Object.keys(user)}`); i have  only id in context no username!

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
            room.room_id === msg.room_id
              ? {
                  ...room,
                  last_msg: msg.content,
                  last_msg_at: new Date(msg.created_at).getTime(),
                }
              : room,
          )
          .sort((a, b) => {
            const aTime = a.last_msg_at || 0;
            const bTime = b.last_msg_at || 0;
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

  const createRoomHandler = async () => {
    setDisplay(false);
    await createRoom(null, groupName); // no user intially so null later add users one by one
    fetchRooms();
  };

  const [display, setDisplay] = useState(false);
  const [groupName, setGroupName] = useState("");

  return (
    <div className="flex flex-col min-h-screen ml-10 mr-4">
      <div className="h-1/5 sticky top-0 bg-slate-50 pb-3">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold pb-4">Live Chat</h1>
          <div className="relative">
            {!display && (
              <button
                onClick={() => setDisplay(true)}
                className="text-2xl font-bold pb-1 mb-2 fixed left-1 bottom-1 cursor-pointer border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 bg-white z-10"
              >
                +
              </button>
            )}
            {display && (
              <div className="fixed left-1 bottom-1 flex gap-2 items-center bg-white p-2 border border-gray-300 rounded-lg z-10">
                <input
                  className="border border-zinc-900 px-2 py-1 rounded outline-none focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  type="text"
                  placeholder="Room name"
                  autoFocus
                />
                <button
                  onClick={createRoomHandler}
                  className="px-3 py-1 bg-zinc-900 text-white rounded hover:bg-zinc-700"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setDisplay(false);
                    setGroupName("");
                  }}
                  className="px-2.5 pb-1 text-gray-500 hover:text-gray-700 font-bold text-xl rounded-full border-1"
                >
                  x
                </button>
              </div>
            )}
          </div>
        </div>
        <Searchbar />
      </div>

      <div className="flex-1 overflow-y-auto pt-4">
        {rooms.map((room) => (
          <SidebarItem
            key={room.room_id}
            room={room}
            onClick={() => {
              navigate(`/chat/${room.display_name}/${room.room_id}`);
            }}
          />
        ))}
      </div>
    </div>
  );
}

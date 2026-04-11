import { useParams } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import Searchbar from "../Searchbar.jsx";

export default function Header() {
  const { displayName, type, role, roomId } = useParams();
  const { clearRoom } = useSocket();

  const deleteChatsHandler = async () => {
    await clearRoom(roomId);
  };


  return (
    <ul className="flex sticky top-0 justify-between items-center p-1 bg-zinc-900 w-full">
      <li className="font-serif text-[#c0d6c2] font-bold text-xl">
        {displayName}
      </li>
      <ul className="flex justify-end gap-1">
        {
          type === "group" && role === "admin" && (
            <li className="text-white cursor-pointer mr-2 bg-slate-200 hover:bg-slate-400 px-1 py-1 rounded-lg hover:animate-pulse  h-6 w-6">
              <img src="/assets/addFriend.svg" alt="add friend" />
            </li>
          )
        }
        <li onClick={deleteChatsHandler} className="text-white cursor-pointer bg-slate-100 hover:bg-slate-200 px-1 py-1 rounded-xl hover:animate-pulse mr-2 h-6 w-6">
          <img src="/assets/chatDelete.svg" alt="delete" />
        </li>
        <li className="text-white cursor-pointer bg-slate-100 hover:bg-orange-500 px-1 py-1 rounded-xl hover:animate-pulse h-6 w-6">
          <img src="/assets/roomDelete.svg" alt="delete" />
        </li>
      </ul>
    </ul>
  );
}

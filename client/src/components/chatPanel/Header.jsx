import { useParams } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import Searchbar from "../Searchbar.jsx";
import { useState, useEffect } from "react";

export default function Header({ members }) {
  const { displayName, type, role, roomId } = useParams();
  const { clearRoom, addMember } = useSocket();

  const deleteChatsHandler = async () => {
    await clearRoom(roomId);
  };

  const showGroupMembersHandler = () => {};

  const onSelectUser = (userId) => {
    setDisplay("");
    addMember(roomId, userId);
  };

  const [display, setDisplay] = useState("");

  useEffect(() => {
    setDisplay("");
  }, [roomId]);

  return (
    <>
      <div className="flex flex-col sticky top-0">
        <ul className="flex  justify-between items-center p-1 bg-zinc-900 w-full">
          <li className="font-serif text-[#c0d6c2] font-bold text-xl">
            {displayName}
          </li>
          <ul className="flex justify-end gap-1">
            {type === "group" &&
              role === "admin" &&
              (display === "" ? (
                <li
                  onClick={() => setDisplay("showSearchbar")}
                  className="text-white cursor-pointer mr-2 bg-slate-200 hover:bg-slate-400 px-1 py-1 rounded-lg hover:animate-pulse  h-6 w-6"
                >
                  <img src="/assets/addFriend.svg" alt="add friend" />
                </li>
              ) : (
                <li
                  onClick={() => setDisplay("")}
                  className="text-white cursor-pointer mr-2 bg-slate-200 hover:bg-slate-400 px-1 py-1 rounded-lg hover:animate-pulse  h-6 w-6"
                >
                  <img src="/assets/close.svg" alt="close" />
                </li>
              ))}
            {type === "group" && (
              <li
                onClick={showGroupMembersHandler}
                className="text-white cursor-pointer bg-slate-100 hover:bg-slate-200 px-1 py-1 rounded-lg hover:animate-pulse mr-2 h-6 w-6"
              >
                <img src="/assets/group.svg" alt="delete" />
              </li>
            )}
            
            <li
              onClick={deleteChatsHandler}
              className="text-white cursor-pointer bg-slate-100 hover:bg-slate-200 px-1 py-1 rounded-xl hover:animate-pulse mr-2 h-6 w-6"
            >
              <img src="/assets/chatDelete.svg" alt="delete" />
            </li>

            <li className="text-white cursor-pointer bg-slate-100 hover:bg-orange-500 px-1 py-1 rounded-xl hover:animate-pulse h-6 w-6">
              <img src="/assets/roomDelete.svg" alt="delete" />
            </li>
          </ul>
        </ul>
        {display === "" && (
          <a
            className="text-[#000] text-[10px] bg-gradient-to-r from-slate-200 "
            href="https://www.freepik.com/free-vector/app-icon-doodle-pattern_363621845.htm#fromView=search&page=3&position=44&uuid=e8c953a4-381c-4aeb-abd0-b0f4890a4988&query=chat+pattern"
          >
            <span className="font-bold">credits: </span>
            <span>Image by vector_corp on Freepik</span>
          </a>
        )}
        <div className="sticky top-14 right-0 w-full relative">
          {display === "showSearchbar" && <Searchbar onSelectUser={onSelectUser} />}
        </div>
      </div>
    </>
  );
}

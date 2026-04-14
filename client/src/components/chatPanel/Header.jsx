import { useParams } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import Searchbar from "../Searchbar.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GroupMembers from "../../containers/GroupMembers";

export default function Header({ members, setChatInputDisplay }) {
  const { displayName, type, role, roomId } = useParams();
  const { clearRoom, addMember, deleteRoom } = useSocket();
  const navigate = useNavigate();

  const deleteChatsHandler = async () => {
    await clearRoom(roomId);
  };

  const showGroupMembersHandler = () => {
    setDisplay("showGroupMembers");
    setChatInputDisplay(false);
  };

  const onSelectUser = async (userId) => {
    try {
      await addMember(roomId, userId);
    } catch (error) {
      console.error("Error adding member:", error);
    }
    setDisplay("");
  };

  const roomDeleteHandler = async () => {
    try {
      await deleteRoom(roomId);
      navigate("/chat");
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (display === "showGroupMembers") {
      setChatInputDisplay(false);
    } else {
      setChatInputDisplay(true);
    }
  }, [display]);

  useEffect(() => {
    setDisplay("");
  }, [roomId]);

  return (
    <>
      <div
        className={`flex flex-col sticky top-0 ${display !== "" ? "backdrop-blur-xl bg-white/20 border border-white/30" : ""} `}
      >
        <ul className="flex  justify-between items-center p-1 bg-zinc-900 w-full">
          <li className="font-serif text-[#c0d6c2] font-bold text-xl">
            {displayName}
          </li>
          <ul className="flex justify-end gap-1">
            {type === "group" &&
              role === "admin" &&
              (display === "showSearchbar" ? (
                <li
                  onClick={() => {
                    setDisplay("");
                  }}
                  className="text-white cursor-pointer mr-2 bg-slate-200 hover:bg-slate-400 px-1 py-1 rounded-lg hover:animate-pulse  h-6 w-6"
                >
                  <img src="/assets/close.svg" alt="close" />
                </li>
              ) : (
                <li
                  onClick={() => setDisplay("showSearchbar")}
                  className="text-white cursor-pointer mr-2 bg-slate-200 hover:bg-slate-400 px-1 py-1 rounded-lg hover:animate-pulse  h-6 w-6"
                >
                  <img title="add member" src="/assets/addFriend.svg" alt="add friend" />
                </li>
              ))}
            {type === "group" &&
              (display === "showGroupMembers" ? (
                <li
                  onClick={() => {
                    setDisplay("");
                    setChatInputDisplay(true);
                  }}
                  className="text-white cursor-pointer mr-2 bg-slate-200 hover:bg-slate-400 px-1 py-1 rounded-lg hover:animate-pulse  h-6 w-6"
                >
                  <img src="/assets/close.svg" alt="close" />
                </li>
              ) : (
                <li
                  onClick={showGroupMembersHandler}
                  className="text-white cursor-pointer bg-slate-100 hover:bg-slate-200 px-1 py-1 rounded-lg hover:animate-pulse mr-2 h-6 w-6"
                >
                  <img title="view members" src="/assets/group.svg" alt="delete" />
                </li>
              ))}

            <li
              onClick={deleteChatsHandler}
              className="text-white cursor-pointer bg-slate-100 hover:bg-slate-200 px-1 py-1 rounded-xl hover:animate-pulse mr-2 h-6 w-6"
            >
              <img title="clear chat" src="/assets/chatDelete.svg" alt="delete" />
            </li>

            {(role === "admin" && type === "group") || type === "direct" ? (
              <li
                onClick={roomDeleteHandler}
                className="text-white cursor-pointer bg-slate-100 hover:bg-orange-500 px-1 py-1 rounded-xl hover:animate-pulse h-6 w-6"
              >
                <img src="/assets/roomDelete.svg" title="delete room" alt="delete" />
              </li>
            ) : null}
          </ul>
        </ul>
        {display === "" && (
          <div
            className="text-[#000] text-[10px] bg-gradient-to-r from-slate-200 "
            href="https://www.freepik.com/free-vector/app-icon-doodle-pattern_363621845.htm#fromView=search&page=3&position=44&uuid=e8c953a4-381c-4aeb-abd0-b0f4890a4988&query=chat+pattern"
          >
            <a href="https://www.freepik.com/free-vector/app-icon-doodle-pattern_363621845.htm#fromView=search&page=3&position=44&uuid=e8c953a4-381c-4aeb-abd0-b0f4890a4988&query=chat+pattern">
              <span className="font-bold">credits: </span>
              <span>Image by vector_corp on Freepik</span>
            </a>
            <a href="https://www.flaticon.com">
              <span className="font-bold ml-8">Icons: </span>
              <span>by Flaticon</span>
            </a>
          </div>
        )}
        <div className="sticky top-14 w-full relative">
          {display === "showSearchbar" && (
            <Searchbar onSelectUser={onSelectUser} />
          )}
        </div>

        {display === "showGroupMembers" && (
          <div className="flex flex-col mx-auto flex-1 w-2/5 bg-slate-100 text-slate-900 overflow-y-auto">
            <GroupMembers members={members} />
          </div>
        )}
      </div>
    </>
  );
}

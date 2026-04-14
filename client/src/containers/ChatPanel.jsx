import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMessages } from "../services/MessageService";
import { getRoomMembers } from "../services/RoomService";
import { mapMessage } from "../mapper/mapGetMessages";
import { useAuth } from "../context/AuthContext";
import Bubble from "../components/cards/Bubble";
import ChatInput from "../components/ChatInput";
import Header from "../components/chatPanel/Header";
import { useSocket } from "../context/SocketContext";


export default function ChatPanel() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [chatData, setChatData] = useState(null);
  const [members, setMembers] = useState([]);

  const { sendMessage, onReceiveMessage, joinRoom, onRoomCleared, onMemberAdded, deleteMessage, onMessageDeleted } = useSocket();

  const { roomId } = useParams();
  useEffect(() => {
    joinRoom(roomId);
  }, [joinRoom, roomId]);

  useEffect(() => {
    const memberAddedHandler = (data) => {
      // data contains room_id too thats why we are not checking for roomId
      setMembers((prev) => [...prev, {
        id: data.member_id,
        username: data.username,
        role: data.role
      }]);
    };
    const off = onMemberAdded(memberAddedHandler);
    return () => {
      off();
    };
  }, [onMemberAdded]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await getRoomMembers(roomId);
        setMembers(res.data);
        console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMembers();
  }, [roomId]);

  useEffect(() => {
    let isCancelled = false;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await getMessages(roomId);
        
        if (!isCancelled)
          setChatData(res.data.map((msg) => mapMessage(msg, user.id)));
      } catch (error) {
        console.error(error);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchMessages();

    return () => {
      isCancelled = true;
    };
  }, [roomId]);

  useEffect(() => {
    const receiveMessageHandler = (msg) => {
      const mappedMsg = mapMessage(msg, user.id);
      setChatData((prev) => [...(prev || []), mappedMsg]);
    };

    const off = onReceiveMessage(receiveMessageHandler);

    return () => {
      off();
    };
  }, [onReceiveMessage, user.id, roomId]);

  useEffect(() => {
    const onRoomClearedHandler = () => {
      setChatData("")
    }
    const off = onRoomCleared(onRoomClearedHandler);
    return () => {
      off();
    };
  }, [onRoomCleared]);

  const [chatInputDisplay, setChatInputDisplay] = useState(false);

  
  const onDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(roomId, messageId);
    } catch(error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const onMessageDeletedHandler = (data) => {
      const messageId = (typeof data === 'object') ? data.messageId : data;
      setChatData((prev) => prev.filter((msg) => msg.id !== messageId));
    };
    const off = onMessageDeleted(onMessageDeletedHandler);
    return () => {
      off();
    };
  }, [onMessageDeleted]);


  return (
    <>
      <Header members={members} setChatInputDisplay={setChatInputDisplay} />
      <div className="flex flex-col justify-between h-[100vh]">
        <div className="flex flex-col justify-start">

         

          {loading ? (
            <p>Loading...</p>
          ) : (
            chatData && chatData.map((msg) => <Bubble key={msg.id} {...msg} onDelete={onDeleteMessage}/>)
          )}
        </div>
        {
          chatInputDisplay && <ChatInput />
        }
      </div>
    </>
  );
}


import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMessages } from "../services/MessageService";
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
  const { sendMessage, onReceiveMessage, joinRoom } = useSocket();

  const { roomId } = useParams();
  useEffect(() => {
    joinRoom(roomId);
  }, [joinRoom, roomId]);

  useEffect(() => {
    let isUnmounted = false;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await getMessages(roomId);
        if (!isUnmounted)
          setChatData(res.data.map((msg) => mapMessage(msg, user.id)));
      } catch (error) {
        console.error(error);
      } finally {
        if (!isUnmounted) setLoading(false);
      }
    };

    fetchMessages();

    return () => {
      isUnmounted = true;
    };
  }, [roomId]);

  useEffect(() => {
    const receiveMessageHandler = (msg) => {
      console.log("Received message:", msg);
      const mappedMsg = mapMessage(msg, user.id);
      console.log("Mapped message:", mappedMsg);
      setChatData((prev) => [...(prev || []), mappedMsg]);
    };

    const off = onReceiveMessage(receiveMessageHandler);

    return () => {
      off();
    };
  }, [onReceiveMessage, user.id, roomId]);

  return (
    <>
      <Header />
      <div className="flex flex-col justify-between h-[100vh]">
        <a
          className="text-[#c0d6c2] text-sm"
          href="https://www.freepik.com/free-vector/app-icon-doodle-pattern_363621845.htm#fromView=search&page=3&position=44&uuid=e8c953a4-381c-4aeb-abd0-b0f4890a4988&query=chat+pattern"
        >
          Image by vector_corp on Freepik
        </a>

        {loading ? (
          <p>Loading...</p>
        ) : (
          chatData && chatData.map((msg) => <Bubble key={msg.id} {...msg} />)
        )}
        <ChatInput />
      </div>
    </>
  );
}

import {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext.jsx";

export default function ChatInput() {
  const [content, setContent] = useState("");
  const { roomId } = useParams();
  const { sendMessage } = useSocket();
  

  useEffect(() => {
    
  }, []);
  const sendHandler = () => {
    if (!content.trim()) return;
    sendMessage(roomId, content);
    setContent("");
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendHandler();
    }
  }
  return (
    <div className="flex items-center gap-2 sticky bottom-0 w-full bg-white ">
      <textarea
        className="w-full h-12 py-2 resize-none px-4 border-1 bg-slate-100 outline-none focus:border-0 focus:ring-1 focus:ring-slate-400 rounded-r-xl"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        type="text" 
        placeholder="Type your message..."
      ></textarea>
      <button onClick={sendHandler} className="p-2  text-slate-100 rounded-full hover:bg-[#21c063]">
        <img src="../../assets/send.svg" className="w-5 h-5 ml-1" />
      </button>
    </div>
  );
}
// #96731d
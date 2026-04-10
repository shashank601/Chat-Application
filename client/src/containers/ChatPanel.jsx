import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMessages } from "../services/MessageService";
import { mapMessage } from "../mapper/mapGetMessages";
import { useAuth } from "../context/AuthContext";
import Bubble  from "../components/cards/Bubble";
import ChatInput from "../components/ChatInput";
export default function ChatPanel() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [chatData, setChatData] = useState(null);
    
    const { roomId } = useParams();


    useEffect(() => {
        let isUnmounted = false;

        const fetchMessages = async () => {
            try {
                setLoading(true);
                const res = await getMessages(roomId);
                if (!isUnmounted) 
                    setChatData(res.data.map(msg => mapMessage(msg, user.id)));
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

    return (
        <div>
            <h1>room: {roomId}</h1>
            {/* {console.log(chatData)} */}
            
            {loading ? <p>Loading...</p> : chatData.map((msg) => <Bubble key={msg.id} {...msg} />)}
            <ChatInput />
        </div>
    )
}
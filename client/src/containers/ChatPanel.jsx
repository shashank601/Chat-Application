import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMessages } from "../services/MessageService";

export default function ChatPanel() {
    const [loading, setLoading] = useState(true);
    const [chatData, setChatData] = useState(null);
    
    const { roomId } = useParams();


    useEffect(() => {
        let isUnmounted = false;

        const fetchMessages = async () => {
            try {
                setLoading(true);
                const data = await getMessages(roomId);
                if (!isUnmounted) setChatData(data);
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
            <h1>hi {roomId}</h1>
            {loading ? <p>Loading...</p> : <p>{JSON.stringify(chatData)}</p>}
        </div>
    )
}
import User from "../components/cards/User.jsx";
import { createRoom } from "../services/RoomService.js";
import { useState } from "react";

export default function DropDown({ searchResults }) {
    const [loading, setLoading] = useState(true);


    const addFriendHandler = async (userId) => {
        try {
            const response = await createRoom(userId);
            const roomId = response.data.room_id;

            console.log(roomId);
        } catch(err) {

        }
    };
    
    return (


       <ul>
          {searchResults.map((user) => (
            <li key={user.user_id}>
              {user.username} ({user.email})
              <button onClick={
                () => addFriendHandler(user.user_id)}
              >
                add friend
              </button>
            </li>
          ))}
        </ul>
    );
}
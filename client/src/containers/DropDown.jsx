import { createRoom } from "../services/RoomService.js";
import { useState } from "react";

export default function DropDown({ searchResults }) {
    const [loading, setLoading] = useState(true);


    const addFriendHandler = async (userId) => {
        try {
            const response = await createRoom(userId);
        } catch(err) {
          console.log(err);
        }
    };
    
    return (


       <ul>
          {searchResults.map((user) => (
            <li key={user.user_id} className="flex justify-between bg-slate-100 border-1 border-r-0 border-t-0">
              {console.log(user)}
              <div className="flex flex-col font-mono px-3">
                <p>{user.username}</p>
                <p>{user.email}</p>
              </div>
              <button 
                onClick={() => addFriendHandler(user.user_id)}
                className="bg-green-600 px-3 m-2 ml-0 text-slate-200 hover:animate-pulse"
              >
                add
              </button>
            </li>
          ))}
        </ul>
    );
}
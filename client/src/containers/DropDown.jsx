
import { useState } from "react";

export default function DropDown({ searchResults, onSelectUser }) {
    const [loading, setLoading] = useState(true);
    
    
    return (


       <ul className="overflow-y-auto max-h-60 border-1 border-t-0">
          {searchResults.map((user) => (
            <li key={user.user_id} className="flex justify-between bg-slate-100 border-1 border-r-0 border-t-0">
              {console.log(user)}
              <div className="flex flex-col font-mono px-3">
                <p className="w-40 truncate">{user.username}</p>
                <p className="w-40 truncate">{user.email}</p>
              </div>
              <button 
                onClick={() => onSelectUser(user.user_id)}
                className="bg-green-600 px-3 m-2 ml-0 text-slate-200 hover:animate-pulse"
              >
                add
              </button>
            </li>
          ))}
        </ul>
    );
}
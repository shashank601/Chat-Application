import { useState, useEffect } from "react";
import { getRoomMembers } from "../services/RoomService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useParams } from "react-router-dom";

export default function GroupMembers({members}) {
    const {user} = useAuth();

    return (
        <div className="flex flex-col h-[calc(100vh-2.3rem)]  bg-slate-100 text-slate-800 border-b-3 overflow-y-auto mx-5">
            <h1 className="text-lg font-bold p-3 border-b-1 ">Members</h1>
            <ul>
                {members.map((member) => (
                    console.log(member),
                    <li key={member.user_id || member.id} className=" border-b-1">
                        <div className="flex justify-between p-2 hover:bg-slate-200  ">
                            <div className="flex items-center gap-2">
                                <span>{member.username}</span>
                                {member.user_id === user.id && <img src="/assets/you.svg" alt="you" className="w-4 h-4" />}
                            </div>
                            <span className="text-gray-600 text-[12px] lowercase">{member.role}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

//Minor bug: when one group's  member list is open and then someone add me to another group then my opened list get <li> gets corrupted (with wrong id)
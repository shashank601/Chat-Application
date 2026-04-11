import { useState, useEffect } from "react";
import { getRoomMembers } from "../services/RoomService";


export default function GroupMembers({members}) {

    return (
        <div className="flex flex-col h-full w-1/2 bg-slate-100 text-slate-800">
            <h1>Group Members</h1>
            <ul>
                {members.map((member) => (
                    <li key={member.user_id}>{member.username}</li>
                ))}
            </ul>
        </div>
    );
}
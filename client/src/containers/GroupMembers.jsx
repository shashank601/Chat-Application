import { useState, useEffect } from "react";
import { getRoomMembers } from "../services/RoomService";


export default function GroupMembers() {
    const [members, setMembers] = useState([]);

    return (
        <div>
            <h1>Group Members</h1>
            <ul>
                {members.map((member) => (
                    <li key={member.user_id}>{member.username}</li>
                ))}
            </ul>
        </div>
    );
}
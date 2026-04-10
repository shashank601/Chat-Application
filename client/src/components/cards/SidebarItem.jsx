export default function SidebarItem({ room, onClick }) {
    



    
    return (
        // [{ room_id, display_name, type, role, last_msg, last_msg_at }]
        <div className="flex flex-col p-2 truncate w-full bg-slate-50 border-b border-slate-900 hover:bg-gray-200 cursor-pointer" onClick={onClick}>

            <div className="h-10 ">
                <h2 className="text-lg font-serif">{room.display_name}</h2>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
                <p className="w-3/4 truncate w-full">{room.last_msg || "Say Hi! to start a conversation"}</p>
                {console.log(room.last_msg_at)}
                <p className="w-1/4">{room.last_msg_at || ""}</p>
            </div>
        </div>
    )
}
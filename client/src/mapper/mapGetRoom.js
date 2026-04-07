export function mapRoom(raw) {
    return {
        room_id: raw.room_id,
        display_name: raw.display_name,
        type: raw.type,
        role: raw.role,
        last_msg: raw.last_msg ?? "",
        last_msg_at: raw.last_msg_at ?? null,
    };
}
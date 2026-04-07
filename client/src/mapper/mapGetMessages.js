export function mapMessage(raw, currentUserId) {
    return {
        id: raw.msg_id,
        roomId: raw.room_id,
        senderId: raw.sender_id,
        senderName: raw.sender_name,
        content: raw.content ?? "",
        createdAt: new Date(raw.created_at),
        isMine: raw.sender_id === currentUserId,
    };
}


export function mapMessage(raw, userId) {
    return {
        id: raw?.msg_id,
        roomId: raw?.room_id,
        senderId: raw?.sender_id,
        senderName: raw?.sender_name,
        content: raw?.content ?? "",
        createdAt: new Date(raw?.created_at),
        isMine: Number(raw?.sender_id) === Number(userId),
    };
}
import api from "./Axios.js";

export const createRoom = async (receiver_id = null, group_name) => {
    const response = await api.post("/rooms", {
        receiver_id,
        group_name
    });
    return response.data;
}

export const deleteRoom = async (room_id) => {
    const response = await api.delete(`/rooms/${room_id}`);
    return response.data;
}

export const getMyRooms = async () => {
    const response = await api.get("/rooms/chats");
    return response.data;
}

export const getRoomMembers = async (room_id) => {
    const response = await api.get(`/rooms/${room_id}/members`);
    return response.data;
}

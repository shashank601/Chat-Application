import api from "./Axios.js";


export const getMessages = async (room_id) => {
    const response = await api.get(`/messages/${room_id}`);
    return response.data;
}

export const addMessage = async (room_id, content) => {
    const response = await api.post(`/messages/${room_id}`, {
        content: content
    });
    return response.data;
}

export const deleteMessage = async (room_id, message_id) => {
    const response = await api.delete(`/messages/${room_id}/${message_id}`);
    return response.data;
}


export const clearRoom = async (room_id) => {
    const response = await api.delete(`/messages/${room_id}`);
    return response.data;
    
}
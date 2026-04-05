import api from "./Axios.js";


export const searchUsers = async (query) => {
    const response = await api.get("/users/search", {
        params: {
            q: query
        }
    })
    return response.data;
}




export const addMemberToGroup = async (room_id, member_id) => {
    const response = await api.post(`/users/${room_id}/${member_id}`);
    return response.data;
}




export const leaveRoom = async (room_id) => {
    const response = await api.post(`/users/${room_id}/leave`);
    return response.data;
}



export const promoteToAdmin = async (room_id, member_id) => {
    const response = await api.post(`/users/${room_id}/promote/${member_id}`);
    return response.data;
}

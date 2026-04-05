import api from "./Axios.js";


export const Login = ({email, password}) => {
    const credentials = {email, password};
    return api.post('/auth/login', credentials); // jwt token or error
}



export const Signup = ({username, email, password}) => { 
    const credentials = {name: username, email, password};
    return api.post('/auth/register', credentials); // {id, username, email} or error
}

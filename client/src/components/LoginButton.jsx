import React, {useState, useEffect} from 'react'
import { Login, Verify } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../utils/Token';
import { useAuth } from '../context/AuthContext';

export default function LoginButton({email, password}) {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const {setUser} = useAuth();

	const loginHandler = async () => {
		setLoading(true);
		try {
			const response = await Login({email, password});
			setToken(response.data.data.token);
			
			// Get user data after setting token
			const userResponse = await Verify();
			setUser(userResponse.data.data);
			
			navigate('/chat');
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}


  return (
    <button onClick={loginHandler} disabled={loading} className="p-2 bg-zinc-900 text-white  ">login</button>
  )
}

import { Signup, Verify } from '../services/AuthService.js';
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { setToken } from '../utils/Token.js';

export default function RegisterButton({email, password, username}) {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const {setUser} = useAuth();

	const registerHandler = async () => {
		setLoading(true);
		try {
			const signupResponse = await Signup({email, password, username});
            console.log(signupResponse.data);
            
            if (signupResponse.data.data?.token) {
                setToken(signupResponse.data.data.token);
            }

            const verifyResponse = await Verify();
            setUser(verifyResponse.data.data);
            navigate('/chat');
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}


  return (
    <button onClick={registerHandler} disabled={loading} className="p-2 bg-zinc-900 text-white  ">register</button>
  )
}

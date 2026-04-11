import React, {useState, useEffect} from 'react';
import LoginButton from '../components/LoginButton';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="w-full max-w-[300px] flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <div className="flex flex-col gap-2">
        <input 
          type="email" 
          placeholder="enter email" 
          className="p-2 w-full border border-zinc-900"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /> 

        <input 
          type="password" 
          placeholder="enter password" 
          className="p-2 w-full border border-zinc-900"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* <button className="p-2 bg-zinc-900 text-white">login</button> */}
        <LoginButton email={email} password={password} />
      </div>
    </div>
  );
}
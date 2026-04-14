import React, { useState } from "react";
import RegisterButton from "../components/RegisterButton";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  return (
    <div className="w-full max-w-[300px] flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="enter username"
          className="p-2 w-full border border-zinc-900"
        />
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="enter email"
          className="p-2 w-full border border-zinc-900"
        />

        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="enter password"
          className="p-2  w-full border border-zinc-900"
        />

        <RegisterButton email={email} password={password} username={username} />

        
      </div>
    </div>
  );
}

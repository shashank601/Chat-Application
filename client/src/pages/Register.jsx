
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Signup } from "../services/AuthService";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      await Signup({ username, email, password });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border rounded p-6">
      <h1 className="text-xl font-semibold">Register</h1>

      <form className="mt-4 flex flex-col gap-3" onSubmit={onSubmit}>
        <input
          className="border rounded p-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border rounded p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border rounded p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error ? <div className="text-red-600 text-sm">{error}</div> : null}

        <button className="border rounded p-2" disabled={busy} type="submit">
          {busy ? "Creating..." : "Create account"}
        </button>
      </form>

      <div className="mt-4 text-sm">
        Already have an account? <Link className="underline" to="/login">Login</Link>
      </div>
    </div>
  );
}


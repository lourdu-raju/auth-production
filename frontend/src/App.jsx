import { useState, useEffect } from "react";
import { api } from "./api";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) {
      setMe(null);
      return;
    }
    api
      .me(token)
      .then(setMe)
      .catch(() => logout());
  }, [token]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const fn = mode === "login" ? api.login : api.register;
      const { token: t } = await fn(email, password);
      localStorage.setItem("token", t);
      setToken(t);
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken("");
    setMe(null);
  }

  if (token && me) {
    return (
      <div className="card">
        <h1>Welcome 👋</h1>
        <p>
          Logged in as <strong>{me.email}</strong> (id {me.id})
        </p>
        <details>
          <summary>JWT token</summary>
          <code className="token">{token}</code>
        </details>
        <button onClick={logout}>Log out</button>
      </div>
    );
  }

  return (
    <div className="card">
      <h1>{mode === "login" ? "Log in" : "Create account"}</h1>
      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={busy}>
          {busy ? "..." : mode === "login" ? "Log in" : "Register"}
        </button>
      </form>
      <p className="switch">
        {mode === "login" ? "No account?" : "Have an account?"}{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setError("");
            setMode(mode === "login" ? "register" : "login");
          }}
        >
          {mode === "login" ? "Register" : "Log in"}
        </a>
      </p>
    </div>
  );
}

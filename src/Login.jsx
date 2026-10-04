import { useState } from "react";
import api from "./api";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" o "register"
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  const switchMode = () => {
    setMode(isRegister ? "login" : "register");
    setError("");
    setSuccess("");
  };

  const doLogin = async () => {
    const { data } = await api.post("/api/login", { email, password });
    localStorage.setItem("access_token", data.tokens.access_token);
    localStorage.setItem("refresh_token", data.tokens.refresh_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    onLogin(data.user);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (isRegister) {
        await api.post("/api/register", { username, email, password });
        setSuccess("Account created! Logging you in...");
      }
      await doLogin();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          (isRegister ? "Registration failed" : "Login failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card login">
      <h2>{isRegister ? "Create Account" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        {success && <p style={{ color: "#16a34a", margin: 0 }}>{success}</p>}
        <button disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>
      </form>
      <p style={{ margin: 0, textAlign: "center" }}>
        {isRegister ? "Already have an account?" : "No account yet?"}{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); switchMode(); }}>
          {isRegister ? "Login" : "Register"}
        </a>
      </p>
    </div>
  );
}
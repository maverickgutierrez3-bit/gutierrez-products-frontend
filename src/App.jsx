import { useState } from "react";
import Login from "./Login";
import Products from "./Products";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved && localStorage.getItem("access_token") ? JSON.parse(saved) : null;
  });

  return (
    <div className="container">
      {user ? (
        <Products user={user} onLogout={() => setUser(null)} />
      ) : (
        <Login onLogin={setUser} />
      )}
    </div>
  );
}
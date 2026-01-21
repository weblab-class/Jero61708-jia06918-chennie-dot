import { useNavigate } from "react-router-dom";
import { useContext, useMemo, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { UserContext } from "../../App";

function getBest(difficulty) {
  const raw = localStorage.getItem("kbw_best_scores");
  const obj = raw ? JSON.parse(raw) : {};
  return obj[difficulty] ?? null;
}

export default function Home() {
  const nav = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [difficulty, setDifficulty] = useState("easy");
  const best = useMemo(() => getBest(difficulty), [difficulty]);

  async function logout() {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setUser(null);
  }

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 6 }}>Keyboard Warriors</h1>
      <p style={{ marginTop: 0, color: "#555" }}>
        Click tiles to infer the hidden rule. Green = correct, Red = incorrect.
      </p>

      {/* google login block */}
      <div style={{ marginTop: 16, marginBottom: 18 }}>
        {user === undefined ? (
          <div style={{ color: "#666" }}>Loading login…</div>
        ) : user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {user.picture ? (
              <img
                src={user.picture}
                alt="pfp"
                style={{ width: 34, height: 34, borderRadius: "50%" }}
              />
            ) : null}
            <div>
              <div style={{ fontWeight: 800 }}>{user.name ?? "Logged in"}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{user.email}</div>
            </div>
            <button onClick={logout} style={{ marginLeft: 8 }}>
              Logout
            </button>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ credential: credentialResponse.credential }),
              });

              const data = await res.json();
              if (res.ok) setUser(data);
              else alert(data.error || "Login failed");
            }}
            onError={() => alert("Login failed")}
          />
        )}
      </div>
      {/* end of login block */}

      <h3>Select Difficulty</h3>
      <div style={{ display: "flex", gap: 10 }}>
        {["easy", "medium", "hard"].map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: difficulty === d ? "2px solid #111" : "1px solid #bbb",
              background: difficulty === d ? "#111" : "#eee",
              color: difficulty === d ? "white" : "black",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {d.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 12, color: "#444" }}>
        Personal Best ({difficulty}): <b>{best === null ? "—" : best}</b>
      </div>

      <div style={{ marginTop: 18 }}>
        <button
          onClick={() => nav(`/game?difficulty=${difficulty}`)}
          style={{
            padding: "12px 18px",
            background: "#2563eb",
            color: "white",
            borderRadius: 12,
            fontSize: 16,
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}

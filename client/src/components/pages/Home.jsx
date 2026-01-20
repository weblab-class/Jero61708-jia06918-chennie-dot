import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

function getBest(difficulty) {
  const raw = localStorage.getItem("kbw_best_scores");
  const obj = raw ? JSON.parse(raw) : {};
  return obj[difficulty] ?? null;
}

export default function Home() {
  const nav = useNavigate();
  const [difficulty, setDifficulty] = useState("easy");

  const best = useMemo(() => getBest(difficulty), [difficulty]);

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 6 }}>Keyboard Warriors</h1>
      <p style={{ marginTop: 0, color: "#555" }}>
        Click tiles to infer the hidden rule. Green = correct, Red = incorrect.
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
        <button
          onClick={() => nav("/rules")}
          style={{ padding: "10px 14px", borderRadius: 10 }}
        >
          Rules Book
        </button>
      </div>

      <h3 style={{ marginTop: 24 }}>Select Difficulty</h3>
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

      <div style={{ marginTop: 14, color: "#444" }}>
        Personal Best ({difficulty}):{" "}
        <b>{best === null ? "—" : best}</b>
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

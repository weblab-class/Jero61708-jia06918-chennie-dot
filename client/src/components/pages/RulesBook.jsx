import { useMemo } from "react";
import { RULES, getRuleById } from "../modules/rules";
import { useNavigate } from "react-router-dom";

function loadUnlocked() {
  const raw = localStorage.getItem("kbw_unlocked_rules");
  return raw ? JSON.parse(raw) : [];
}

export default function RulesBook() {
  const nav = useNavigate();
  const unlockedIds = useMemo(() => loadUnlocked(), []);

  const unlockedRules = unlockedIds
    .map((id) => getRuleById(id))
    .filter(Boolean);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h2>Rules Book</h2>
      <p style={{ color: "#666" }}>
        Win games to unlock rules. (Stored locally on this computer.)
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <button onClick={() => nav("/")} style={{ padding: "10px 14px", borderRadius: 10 }}>
          Home
        </button>
      </div>

      {unlockedRules.length === 0 ? (
        <div style={{ padding: 14, border: "1px solid #eee", borderRadius: 12, color: "#666" }}>
          No rules unlocked yet. Go win a game!
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {unlockedRules.map((r) => (
            <div key={r.id} style={{ padding: 14, border: "1px solid #eee", borderRadius: 12 }}>
              <div style={{ fontWeight: 800 }}>{r.name}</div>
              <div style={{ color: "#555", marginTop: 6 }}>{r.description}</div>
            </div>
          ))}
        </div>
      )}

      <hr style={{ margin: "22px 0" }} />

      <details>
        <summary style={{ cursor: "pointer", fontWeight: 700 }}>
          (Dev) All available rules
        </summary>
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {RULES.map((r) => (
            <div key={r.id} style={{ padding: 12, border: "1px dashed #ddd", borderRadius: 12 }}>
              <div style={{ fontWeight: 800 }}>{r.name}</div>
              <div style={{ color: "#666" }}>{r.description}</div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

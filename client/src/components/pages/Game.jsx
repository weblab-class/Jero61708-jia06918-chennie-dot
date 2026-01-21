import { useSearchParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { RULES } from "../modules/rules";

function configForDifficulty(d) {
  if (d === "hard") return { size: 7, moves: 10, correctPoints: 3, wrongPoints: -2 };
  if (d === "medium") return { size: 6, moves: 15, correctPoints: 2, wrongPoints: -1 };
  return { size: 5, moves: 20, correctPoints: 2, wrongPoints: -1 };
}

function loadJson(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function Game() {
  const [params] = useSearchParams();
  const nav = useNavigate();

  const difficulty = params.get("difficulty") || "easy";
  const cfg = useMemo(() => configForDifficulty(difficulty), [difficulty]);

  // Pick a random rule for each game
  const rule = useMemo(() => RULES[Math.floor(Math.random() * RULES.length)], []);

  const [movesLeft, setMovesLeft] = useState(cfg.moves);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("playing"); // playing | won | lost
  const [tiles, setTiles] = useState(() =>
    Array.from({ length: cfg.size }, () =>
      Array.from({ length: cfg.size }, () => "unknown")
    )
  );

  const totalCorrect = useMemo(() => {
    let count = 0;
    for (let r = 0; r < cfg.size; r++) {
      for (let c = 0; c < cfg.size; c++) {
        if (rule.fn(r, c, cfg.size)) count++;
      }
    }
    return count;
  }, [cfg.size, rule]);

  const foundCorrect = useMemo(() => {
    let count = 0;
    for (let r = 0; r < cfg.size; r++) {
      for (let c = 0; c < cfg.size; c++) {
        if (tiles[r][c] === "correct") count++;
      }
    }
    return count;
  }, [tiles, cfg.size]);

  function unlockRule(ruleId) {
    const unlocked = loadJson("kbw_unlocked_rules", []);
    if (!unlocked.includes(ruleId)) {
      unlocked.push(ruleId);
      saveJson("kbw_unlocked_rules", unlocked);
    }
  }

  function updateBestScore(newScore) {
    const bests = loadJson("kbw_best_scores", {});
    const currentBest = bests[difficulty] ?? null;
    if (currentBest === null || newScore > currentBest) {
      bests[difficulty] = newScore;
      saveJson("kbw_best_scores", bests);
    }
  }

  function endGame(nextStatus, finalScore) {
    setStatus(nextStatus);
    updateBestScore(finalScore);

    if (nextStatus === "won") {
      unlockRule(rule.id);
    }
  }

  function reset() {
    setMovesLeft(cfg.moves);
    setScore(0);
    setStatus("playing");
    setTiles(
      Array.from({ length: cfg.size }, () =>
        Array.from({ length: cfg.size }, () => "unknown")
      )
    );
  }

  function handleClick(r, c) {
    if (status !== "playing") return;
    if (movesLeft <= 0) return;
    if (tiles[r][c] !== "unknown") return;

    const isCorrect = !!rule.fn(r, c, cfg.size);

    // update tiles
    setTiles((prev) => {
      const copy = prev.map((row) => row.slice());
      copy[r][c] = isCorrect ? "correct" : "wrong";
      return copy;
    });

    const newMoves = movesLeft - 1;
    setMovesLeft(newMoves);

    const delta = isCorrect ? cfg.correctPoints : cfg.wrongPoints;
    const newScore = score + delta;
    setScore(newScore);

    // check for a win
    const willFoundCorrect = foundCorrect + (isCorrect ? 1 : 0);
    if (willFoundCorrect >= totalCorrect) {
      endGame("won", newScore);
      return;
    }

    if (newMoves <= 0) {
      endGame("lost", newScore);
    }
  }

  const tilePx = cfg.size <= 5 ? 70 : 58;

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0 }}>Game</h2>
          <div style={{ marginTop: 6, color: "#444" }}>
            Difficulty: <b>{difficulty}</b> • Moves Left: <b>{movesLeft}</b> • Score: <b>{score}</b>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={reset} style={{ padding: "10px 14px", borderRadius: 10 }}>
            Restart
          </button>
          <button onClick={() => nav("/rules")} style={{ padding: "10px 14px", borderRadius: 10 }}>
            Rules Book
          </button>
          <button onClick={() => nav("/")} style={{ padding: "10px 14px", borderRadius: 10 }}>
            Home
          </button>
        </div>
      </div>

      {/* rule hint for developing
      <div style={{ marginTop: 14, padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
        <div style={{ color: "#666", fontSize: 14 }}>
          Debug Hint: <b>{rule.description}</b>
        </div>
      </div> */}

      <div
        style={{
          marginTop: 18,
          display: "grid",
          gridTemplateColumns: `repeat(${cfg.size}, ${tilePx}px)`,
          gap: 10,
        }}
      >
        {tiles.map((row, r) =>
          row.map((cell, c) => {
            const bg =
              cell === "unknown" ? "#e5e7eb" : cell === "correct" ? "#16a34a" : "#dc2626";
            const color = cell === "unknown" ? "#111" : "white";

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleClick(r, c)}
                style={{
                  width: tilePx,
                  height: tilePx,
                  borderRadius: 12,
                  border: "1px solid #ddd",
                  background: bg,
                  color,
                  fontWeight: 800,
                  cursor: status === "playing" && cell === "unknown" ? "pointer" : "default",
                }}
              >
                {r},{c}
              </button>
            );
          })
        )}
      </div>

      {status !== "playing" && (
        <div style={{ marginTop: 18, padding: 14, borderRadius: 12, border: "1px solid #ddd" }}>
          {status === "won" ? (
            <>
              <h3 style={{ marginTop: 0 }}>You won 🎉</h3>
              <p style={{ marginBottom: 0 }}>
                Rule unlocked: <b>{rule.name}</b>
              </p>
            </>
          ) : (
            <>
              <h3 style={{ marginTop: 0 }}>Out of moves</h3>
              <p style={{ marginBottom: 0 }}>Try restarting or changing difficulty.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

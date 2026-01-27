// client/src/components/pages/Game.jsx
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { EASY_RULES, MEDIUM_RULES, HARD_RULES } from "../modules/rules";
import "./Game.css";

function configForDifficulty(d) {
  if (d === "hard") return { size: 7, moves: 10, correctPoints: 3, wrongPoints: -2 };
  if (d === "medium") return { size: 6, moves: 15, correctPoints: 2, wrongPoints: -1 };
  return { size: 5, moves: 20, correctPoints: 2, wrongPoints: -1 };
}

function rulesForDifficulty(difficulty) {
  if (difficulty === "hard") return HARD_RULES;
  if (difficulty === "medium") return MEDIUM_RULES;
  return EASY_RULES;
}

function loadJson(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function makeUnknownGrid(size) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => "unknown"));
}

export default function Game() {
  const [params] = useSearchParams();
  const nav = useNavigate();

  const difficulty = params.get("difficulty") || "easy";
  const cfg = useMemo(() => configForDifficulty(difficulty), [difficulty]);

  // pick a rule once per mount
  const rulePool = useMemo(
    () => rulesForDifficulty(difficulty),
    [difficulty]);

  const rule = useMemo(() => {
    return rulePool[Math.floor(Math.random() * rulePool.length)];
  }, [rulePool]);

  const [movesLeft, setMovesLeft] = useState(cfg.moves);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("playing"); // playing | won | lost
  const [tiles, setTiles] = useState(() => makeUnknownGrid(cfg.size));

  useEffect(() => {
    setMovesLeft(cfg.moves);
    setScore(0);
    setStatus("playing");
    setTiles(makeUnknownGrid(cfg.size));
  }, [cfg.moves, cfg.size]);

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
    if (nextStatus === "won") unlockRule(rule.id);
  }

  function reset() {
    setMovesLeft(cfg.moves);
    setScore(0);
    setStatus("playing");
    setTiles(makeUnknownGrid(cfg.size));
  }

  function handleClick(r, c) {
    if (status !== "playing") return;
    if (movesLeft <= 0) return;
    if (tiles[r][c] !== "unknown") return;

    const isCorrect = !!rule.fn(r, c, cfg.size);

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

    const willFoundCorrect = foundCorrect + (isCorrect ? 1 : 0);
    if (willFoundCorrect >= totalCorrect) {
      endGame("won", newScore);
      return;
    }
    if (newMoves <= 0) endGame("lost", newScore);
  }

  return (
    <div className="game">
      <main className="gameMain">
        {/* Top bar */}
        <div className="gameTopBar">
          <div className="gameStats">
            <div className="statPill">
              <div className="statLabel">Score</div>
              <div className="statValue">{score}</div>
            </div>
            <div className="statPill">
              <div className="statLabel">Moves Left</div>
              <div className="statValue">{movesLeft}</div>
            </div>
          </div>

          <div className="gameActions">
            <button className="gameBtn" onClick={() => nav("/")}>
              Home
            </button>
            <button className="gameBtn gameBtnPrimary" onClick={reset}>
              Restart
            </button>
          </div>
        </div>

        {/* Board card */}
        <div className="gameBoardCard">
          <div
            className="gameGrid"
            style={{ gridTemplateColumns: `repeat(${cfg.size}, var(--tile))` }}
          >
            {tiles.map((row, r) =>
              row.map((cell, c) => {
                const cls =
                  cell === "unknown"
                    ? "gameTile"
                    : cell === "correct"
                    ? "gameTile gameTile--correct"
                    : "gameTile gameTile--wrong";

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleClick(r, c)}
                    className={cls}
                    disabled={status !== "playing" || cell !== "unknown" || movesLeft <= 0}
                    aria-label={`tile-${r}-${c}`}
                  />
                );
              })
            )}
          </div>

          <div className="gameLegend">
            <div className="gameLegendGreen">Green: +{cfg.correctPoints}</div>
            <div className="gameLegendRed">Red: {cfg.wrongPoints}</div>
          </div>
        </div>

        {/* End-of-game */}
        {status !== "playing" && (
          <div className="gameEndCard">
            {status === "won" ? (
              <>
                <h3 className="gameEndTitle">You won 🎉</h3>
                <p className="gameEndText">
                  Rule unlocked: <b>{rule.name}</b>
                </p>
              </>
            ) : (
              <>
                <h3 className="gameEndTitle">Out of moves</h3>
                <p className="gameEndText">Try restarting or changing difficulty.</p>
              </>
            )}

            <div className="gameEndActions">
              <button className="gameBtn" onClick={() => nav("/rules")}>
                Rules Book
              </button>
              <button className="gameBtn gameBtnPrimary" onClick={() => nav("/")}>
                Home
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// client/src/components/pages/Game.jsx
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { EASY_RULES, MEDIUM_RULES, HARD_RULES } from "../modules/rules";
import "./Game.css";

function configForDifficulty(d) {
  if (d === "hard") return { size: 7, mistakes: 2, correctPoints: 3, wrongPoints: -2 };
  if (d === "medium") return { size: 6, mistakes: 4, correctPoints: 2, wrongPoints: -1 };
  return { size: 5, mistakes: 6, correctPoints: 2, wrongPoints: -1 };
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

  const rulePool = useMemo(() => rulesForDifficulty(difficulty), [difficulty]);
  const rule = useMemo(() => rulePool[Math.floor(Math.random() * rulePool.length)], [rulePool]);

  useEffect(() => {
    console.log("Selected rule:", rule.id, "-", rule.name);
  }, [rule]);

  const [score, setScore] = useState(0);
  const [tiles, setTiles] = useState(() => makeUnknownGrid(cfg.size));
  const [clicks, setClicks] = useState(0);

  // Reset when difficulty changes
  useEffect(() => {
    setScore(0);
    setTiles(makeUnknownGrid(cfg.size));
    setClicks(0);
  }, [cfg]);

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

  function handleClick(r, c) {
    if (tiles[r][c] !== "unknown") return;

    const isCorrect = !!rule.fn(r, c, cfg.size);

    setTiles(prev => {
      const copy = prev.map(row => row.slice());
      copy[r][c] = isCorrect ? "correct" : "wrong";
      return copy;
    });

    const newClicks = clicks + 1;
    setClicks(newClicks);

    // Soft mistake logic: only subtract points if mistakes exceed allowed limit
    let newScore = score;
    if (isCorrect) {
      newScore += cfg.correctPoints;
    } else {
      if (newClicks > totalCorrect + cfg.mistakes) {
        newScore += cfg.wrongPoints; // apply penalty only after limit
      }
    }
    setScore(newScore);

    // Unlock rule when all correct tiles are found
    const willFoundCorrect = foundCorrect + (isCorrect ? 1 : 0);
    if (willFoundCorrect >= totalCorrect) {
      unlockRule(rule.id);
      updateBestScore(newScore);
    }
  }

  function reset() {
    setScore(0);
    setTiles(makeUnknownGrid(cfg.size));
    setClicks(0);
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
              <div className="statLabel">Clicks</div>
              <div className="statValue">{clicks}</div>
            </div>
          </div>

          <div className="gameActions">
            <button className="gameBtn" onClick={() => nav("/")}>Home</button>
            <button className="gameBtn gameBtnPrimary" onClick={reset}>Restart</button>
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
                    disabled={cell !== "unknown"}
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
      </main>
    </div>
  );
}

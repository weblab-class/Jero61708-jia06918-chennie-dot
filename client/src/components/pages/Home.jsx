import { useNavigate } from "react-router-dom";
import { useContext, useMemo, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { UserContext } from "../../App";
import "./Home.css";

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
    <div className="home">
      {/* optional top right link like screenshot */}
      <div className="homeTopRight">
        <button className="homeLink" onClick={() => nav("/signup")}>
          Sign Up / Login
        </button>
      </div>

      <main className="homeMain">
        <h1 className="homeTitle">Rules You Didn't Read</h1>
        <p className="homeSubtitle">
          Click tiles to infer the hidden rule. Green = correct, Red = incorrect.
        </p>

        {/* rules/info card (matches screenshot vibe) */}
        <div className="u-panel homeCard">
          <ul>
            <li>💚 Gain 2 points for a correct tile</li>
            <li>❤️ Lose 1 point for an incorrect tile</li>
            <li>💜 Each click = one move</li>
            <li>💙 Learn the rule before moves run out!</li>
          </ul>
        </div>

        {/* google login block */}
        <div className="homeLogin">
          {user === undefined ? (
            <div className="homeLoginLoading">Loading login…</div>
          ) : user ? (
            <div className="homeAuthRow">
              {user.picture && (
                <img src={user.picture} alt="pfp" className="homeAvatar" />
              )}
              <div className="homeUserMeta">
                <div className="homeUserName">{user.name}</div>
                <div className="homeUserEmail">{user.email}</div>
              </div>
              <button onClick={logout} className="homeLogout">
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


        <h2 className="homeSectionTitle">Difficulty</h2>
        <div className="homePills">
          {["easy", "medium", "hard"].map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={[
                "u-pill",
                difficulty === d ? "u-pill--active" : "",
                d === "easy"
                  ? "u-pill--easy"
                  : d === "medium"
                  ? "u-pill--medium"
                  : "u-pill--hard",
              ].join(" ")}
              style={{
                outline: difficulty === d ? "3px solid rgba(0,0,0,.12)" : "none",
                transform: difficulty === d ? "translateY(-1px)" : "none",
              }}
            >
              {d[0].toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        <div className="homeBest">
          Personal Best ({difficulty}): <b>{best === null ? "—" : best}</b>
        </div>

        <div className="homeFooter">
          <div className="homeButtons">
            <button
              className="u-cta"
              onClick={() => nav(`/game?difficulty=${difficulty}`)}
            >
              Start Game
            </button>

            <button
              className="gameBtn homeRulesBtn"
              onClick={() => nav("/rules")}
            >
              Rules Book
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

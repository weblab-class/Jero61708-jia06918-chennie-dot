import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext, useEffect, useState } from "react";

import Home from "./components/pages/Home";
import Game from "./components/pages/Game";
import RulesBook from "./components/pages/RulesBook";
import "./utilities.css";

export const UserContext = createContext(null);

export default function App() {
  // undefined = loading, null = logged out, object = logged in
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    fetch("/api/whoami", { credentials: "include" })
      .then((r) => r.json())
      .then((u) => setUser(u))
      .catch(() => setUser(null));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/rules" element={<RulesBook />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

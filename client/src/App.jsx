import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Game from "./components/pages/Game";
import RulesBook from "./components/pages/RulesBook";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/rules" element={<RulesBook />} />
      </Routes>
    </BrowserRouter>
  );
}

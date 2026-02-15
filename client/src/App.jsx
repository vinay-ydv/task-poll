import { HashRouter, Routes, Route } from "react-router-dom";
import CreatePoll from "../pages/CreatePoll.jsx";
import PollRoom from "../pages/PollRoom.jsx";


function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<CreatePoll />} />
        <Route path="/poll/:id" element={<PollRoom />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

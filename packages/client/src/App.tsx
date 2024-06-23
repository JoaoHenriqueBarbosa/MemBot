
import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DashboardView } from "./components/dashboard-view";
import { ChatbotView } from "./components/chatbot-view";
import { SettingsView } from "./components/settings-view";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardView />} />
        <Route path="/chatbot" element={<ChatbotView />} />
        <Route path="/settings" element={<SettingsView />} />
      </Routes>
    </Router>
  );
}

export default App;


import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DashboardView } from "./components/dashboard-view";
import { ChatbotView } from "./components/ChatbotView";
import { SettingsView } from "./components/SettingsView";

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

import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DashboardView } from "./components/dashboard-view";
import { ChatbotView } from "./components/chatbot-view";
import { SettingsView } from "./components/settings-view";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardView />} />
          <Route path="/chatbot" element={<ChatbotView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

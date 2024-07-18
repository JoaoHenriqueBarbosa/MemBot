import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DashboardView } from "./components/dashboard-view";
import { ChatbotView } from "./components/chatbot-view";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardView />} />
          <Route path="/chatbot" element={<ChatbotView />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

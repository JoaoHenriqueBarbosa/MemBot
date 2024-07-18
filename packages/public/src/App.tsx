import { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { DashboardView } from "./components/dashboard-view";
import { ChatbotView } from "./components/chatbot-view";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthForm } from "./components/auth-form";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from './hooks/useAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const {  token } = useAuth();

  const isAuthenticated = useMemo(() => !!token, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={
          isAuthenticated ? <Navigate to="/" /> : <AuthForm />
        } />
        <Route path="/" element={isAuthenticated ? <DashboardView /> : <Navigate to="/auth" />} />
        <Route path="/chatbot" element={isAuthenticated ? <ChatbotView /> : <Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

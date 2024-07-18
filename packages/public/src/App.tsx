import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { DashboardView } from "./components/dashboard-view";
import { ChatbotView } from "./components/chatbot-view";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthComponents } from "./components/auth-components";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from './hooks/useAuth';
import { handleLogin, handleRegister, handleLogout } from './utils/auth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setToken } = useAuth();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, [setToken]);

  const onLogin = async (username: string, password: string) => {
    const success = await handleLogin(username, password, setToken);
    if (success) {
      setIsAuthenticated(true);
    }
  };

  const onRegister = async (username: string, password: string) => {
    const success = await handleRegister(username, password, setToken);
    if (success) {
      setIsAuthenticated(true);
    }
  };

  const onLogout = () => {
    handleLogout(setToken);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={
          isAuthenticated ? <Navigate to="/" /> : <AuthComponents onLogin={onLogin} onRegister={onRegister} />
        } />
        <Route path="/" element={isAuthenticated ? <DashboardView onLogout={onLogout} /> : <Navigate to="/auth" />} />
        <Route path="/chatbot" element={isAuthenticated ? <ChatbotView onLogout={onLogout} /> : <Navigate to="/auth" />} />
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

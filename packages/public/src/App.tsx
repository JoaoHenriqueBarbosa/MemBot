import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { DashboardView } from "./components/dashboard-view";
import { ChatbotView } from "./components/chatbot-view";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthComponents } from "./components/auth-components";
import { API_HOST, API_PROTOCOL } from "./lib/consts";

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRegister = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/auth" element={
            isAuthenticated ? <Navigate to="/" /> : <AuthComponents onLogin={handleLogin} onRegister={handleRegister} />
          } />
          <Route path="/" element={isAuthenticated ? <DashboardView /> : <Navigate to="/auth" />} />
          <Route path="/chatbot" element={isAuthenticated ? <ChatbotView /> : <Navigate to="/auth" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

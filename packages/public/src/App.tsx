import { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { DashboardPage } from "./components/dashboard-page";
import { ChatbotPage } from "./components/chatbot-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthForm } from "./components/auth-form";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from './hooks/useAuth';
import { EmailVerification } from "./components/email-verification";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { token } = useAuth();

  const isAuthenticated = useMemo(() => !!token, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={
          isAuthenticated ? <Navigate to="/" /> : <AuthForm />
        } />
        <Route path="/" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/auth" />} />
        <Route path="/chatbot" element={isAuthenticated ? <ChatbotPage /> : <Navigate to="/auth" />} />
        <Route path="/verify-email" element={<EmailVerification />} />
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

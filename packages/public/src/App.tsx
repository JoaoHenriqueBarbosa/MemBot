import { useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DashboardPage } from "./components/dashboard-page";
import { ChatbotPage } from "./components/chatbot-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthForm } from "./components/auth-form";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { EmailVerification } from "./components/email-verification";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { token, isLoading } = useAuth();

  const isAuthenticated = useMemo(() => !!token, [token]);

  if (isLoading) {
    return (
      <div className="w-full h-screen">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <DashboardPage /> : <Navigate to="/auth" />
          }
        />
        <Route
          path="/chatbot"
          element={isAuthenticated ? <ChatbotPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={isAuthenticated ? <Navigate to="/" /> : <AuthForm />}
        />
        <Route path="/verify-email" element={<EmailVerification />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;

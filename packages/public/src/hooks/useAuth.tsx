import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = (): {
  token: string | null;
  setToken: (token: string | null) => void;
} => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

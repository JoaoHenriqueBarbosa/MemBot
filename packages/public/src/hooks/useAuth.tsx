import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { User } from "private/utils/types";

export const useAuth = (): {
  token: string | null;
  user: Partial<User> | null;
  setAuth: (token: string | null, user: Partial<User> | null) => void;
} => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

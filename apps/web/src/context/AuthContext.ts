import { createContext, useContext } from "react";
import type { User } from "../lib/firebase";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  configured: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  configured: false,
  logout: async () => {},
});

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

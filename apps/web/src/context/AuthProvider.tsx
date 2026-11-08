import {
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  auth,
  isFirebaseConfigured,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type User,
} from "../lib/firebase";
import { AuthContext } from "./AuthContext";
import { authService } from "../services/authService";

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isFirebaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(configured && Boolean(auth));

  useEffect(() => {
    if (!auth || !configured) {
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (firebaseUser) => {
          setUser(firebaseUser); // null if logged out, User if logged in
          setLoading(false);
        },
        (error) => {
          console.error("Firebase auth state error:", error);
          setUser(null);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error("Failed to attach Firebase auth listener:", err);
    }
  }, [configured]);

  const logout = useCallback(async () => {
    authService.clearPendingRegistration();
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.error("Firebase signOut error:", err);
      }
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, configured, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

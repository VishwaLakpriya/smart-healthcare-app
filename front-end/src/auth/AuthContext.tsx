import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

export type CurrentUser = { uid: string; role: string; name: string; email: string } | null;

type AuthContextType = {
  user: CurrentUser;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: "admin" | "clerk") => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as any);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser>(null);
  const [loading, setLoading] = useState(true);

  async function refreshMe() {
    try {
      const { data } = await api.get("/auth/me", { withCredentials: true });
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refreshMe(); }, []);

  async function login(email: string, password: string) {
    await api.post("/auth/login", { email, password }, { withCredentials: true });
    await refreshMe();
  }

  async function register(name: string, email: string, password: string, role: "admin" | "clerk" = "clerk") {
    await api.post("/auth/register", { name, email, password, role }, { withCredentials: true });
    await refreshMe();
  }

  async function logout() {
    await api.post("/auth/logout", {}, { withCredentials: true });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
}

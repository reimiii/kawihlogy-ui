import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  isInitialized: boolean;
};

type JwtPayload = {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

function decodeJwtPayload(token: string): JwtPayload {
  const [, payload] = token.split(".");
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const json = atob(base64);
  return JSON.parse(json);
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJwtPayload(token);
    if (typeof payload.exp !== "number") return true;
    const now = Date.now();
    const expireTime = payload.exp * 1000;
    const expired = expireTime < now;

    return expired;
  } catch {
    return true;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const setAccessToken = useCallback((token: string | null) => {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
    setAccessTokenState(token);
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
  }, [setAccessToken]);

  // FIX 1: Logika Inisialisasi (useEffect pertama)
  // Dibuat mandiri dan hanya berjalan sekali saat komponen mount.
  useEffect(() => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token && !isTokenExpired(token)) {
        setAccessTokenState(token);
      } else {
        // Jika token tidak valid, cukup biarkan state accessToken tetap null.
        // Tidak perlu memanggil logout() di sini.
        localStorage.removeItem("accessToken");
      }
    } catch (error) {
      console.error("Failed to initialize auth state:", error);
      localStorage.removeItem("accessToken");
    } finally {
      // Pastikan inisialisasi selalu selesai.
      setIsInitialized(true);
    }
  }, []); // <-- FIX 2: Dependency array kosong agar hanya berjalan sekali.

  // FIX 3: Logika Timeout (useEffect kedua)
  // Logika ini sudah benar, tetapi sekarang menjadi lebih stabil karena `logout` tidak lagi menyebabkan loop.
  useEffect(() => {
    if (!accessToken) return;

    const payload = decodeJwtPayload(accessToken);
    const expireTime = payload.exp * 1000;
    const timeout = expireTime - Date.now() - 5000; // Logout 5 detik sebelum token expired

    if (timeout > 0) {
      const timer = setTimeout(() => {
        console.log("Access token expired, logging out automatically.");
        logout();
      }, timeout);
      return () => clearTimeout(timer);
    } else {
      // Jika token sudah expired saat state diset, langsung logout.
      logout();
    }
  }, [accessToken, logout]);

  const value = useMemo(
    () => ({
      accessToken,
      setAccessToken,
      logout,
      isInitialized,
    }),
    [accessToken, setAccessToken, logout, isInitialized],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

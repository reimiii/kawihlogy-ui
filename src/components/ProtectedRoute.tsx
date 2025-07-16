import { Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Unauthorized } from "../errors/Unauthorized";

export function ProtectedRoute() {
  const { accessToken, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className="p-4 uppercase font-bold text-[#928374]">
        INITIALIZING...
      </div>
    );
  }

  if (!accessToken) return <Unauthorized />;

  return <Outlet />;
}

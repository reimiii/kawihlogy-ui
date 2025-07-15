import { Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { accessToken, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className="p-4 uppercase font-bold text-[#928374]">
        INITIALIZING...
      </div>
    );
  }

  if (!accessToken)
    return (
      <div className="p-4 border-4 border-[#3c3836] bg-[#d5c4a1] text-[#cc241d] font-bold uppercase">
        Access Denied: Authentication Required.
      </div>
    );

  return <Outlet />;
}

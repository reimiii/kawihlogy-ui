import { Link, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

export function Layout() {
  const { accessToken, isInitialized, logout } = useAuth();

  if (!isInitialized) {
    return (
      <div className="p-4 uppercase font-bold text-[#928374]">
        INITIALIZING...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf1c7] text-[#3c3836] font-mono">
      <nav className="bg-[#d5c4a1] border-b-4 border-[#3c3836] px-8 py-4 flex justify-between items-center shadow-[4px_4px_0_0_#3c3836]">
        <Link
          to="/"
          className="text-2xl font-extrabold uppercase text-[#3c3836]"
        >
          Kawihlogy
        </Link>
        <div className="flex items-center space-x-6">
          {accessToken && (
            <Link
              to="/journals/create"
              className="bg-[#98971a] text-[#282828] px-4 py-2 font-bold uppercase border-2 border-[#3c3836] shadow-[2px_2px_0_0_#3c3836] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              New Journal
            </Link>
          )}
          {accessToken ? (
            <>
              <Link
                to="/p"
                className="font-bold uppercase text-[#3c3836] hover:text-[#458588] hover:underline"
              >
                Profile
              </Link>
              <Link
                to={`/login`}
                onClick={logout}
                className="font-bold uppercase text-[#cc241d] hover:underline"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-bold uppercase text-[#3c3836] hover:text-[#458588] hover:underline"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="font-bold uppercase text-[#3c3836] hover:text-[#b16286] hover:underline"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="flex-grow p-8 bg-[#fbf1c7] border-x-4 border-[#3c3836]">
        <Outlet />
      </main>

      <footer className="bg-[#d5c4a1] border-t-4 border-[#3c3836] text-center py-4 text-xs uppercase font-bold text-[#928374]">
        Created by Me
      </footer>
    </div>
  );
}

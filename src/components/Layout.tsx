import { Outlet, Link } from "react-router";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf1c7] text-[#3c3836] font-sans">
      <nav className="bg-[#ebdbb2] px-4 py-2 flex justify-between items-center shadow-md">
        <Link to="/" className="text-lg font-bold">
          Kawihlogy
        </Link>
        <div className="space-x-4">
          <Link to="/login" className="hover:underline">
            Login
          </Link>
          <Link to="/register" className="hover:underline">
            Register
          </Link>
        </div>
      </nav>

      <main className="flex-grow p-6">
        <Outlet />
      </main>

      <footer className="bg-[#ebdbb2] text-center py-2 text-sm shadow-inner">
        Gruvbox Light Themed Journal • 2025
      </footer>
    </div>
  );
}

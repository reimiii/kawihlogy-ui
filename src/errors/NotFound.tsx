export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fbf1c7] text-[#3c3836] flex flex-col items-center justify-center font-mono">
      <h1 className="text-6xl font-bold text-[#cc241d]">404</h1>
      <p className="text-xl text-[#d79921] mt-2">Page Not Found</p>
      <p className="text-sm text-[#928374] mt-1">
        The page you are looking for does not exist.
      </p>
    </div>
  );
}

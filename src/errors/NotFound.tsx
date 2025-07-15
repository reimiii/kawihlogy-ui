import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <div className="w-full py-12 border-4 border-dashed border-[#928374] bg-[#d5c4a1]">
        <h1 className="text-9xl font-black text-[#cc241d] tracking-tighter">
          404
        </h1>
      </div>

      <div className="w-full py-8">
        <h2 className="text-3xl font-extrabold uppercase text-[#3c3836]">
          Resource Not Found
        </h2>
        <p className="mt-2 text-sm uppercase text-[#928374] tracking-wider">
          The page you were looking for does not exist or has been moved.
        </p>
      </div>

      <div className="w-full max-w-md">
        <Link
          to="/"
          className="block w-full py-3 px-4 bg-[#98971a] text-[#282828] font-bold uppercase border-2 border-[#3c3836] shadow-[4px_4px_0_0_#3c3836] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-transform text-center"
        >
          Return to Safety
        </Link>
      </div>
    </div>
  );
}

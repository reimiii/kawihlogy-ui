import { Link } from "react-router";

interface ErrorDisplayProps {
  statusCode: string;
  title: string;
  message: string;
  action?: {
    text: string;
    to: string;
  };
}

export function ErrorDisplay({
  statusCode,
  title,
  message,
  action,
}: ErrorDisplayProps) {
  return (
    <div className="w-full bg-[#d5c4a1] border-4 border-[#3c3836] shadow-[8px_8px_0_0_#3c3836]">
      <div className="text-center py-16 border-b-4 border-dashed border-[#928374] bg-[#fbf1c7]">
        <h1 className="text-9xl font-black text-[#cc241d] tracking-tighter">
          {statusCode}
        </h1>
      </div>

      <div className="text-center p-8">
        <h2 className="text-3xl font-extrabold uppercase text-[#3c3836]">
          {title}
        </h2>
        <p className="mt-2 text-sm uppercase text-[#928374] tracking-wider max-w-lg mx-auto">
          {message}
        </p>
      </div>

      {action && (
        <div className="p-8 border-t-4 border-dashed border-[#928374]">
          <div className="w-full max-w-md mx-auto">
            <Link
              to={action.to}
              className="block w-full py-3 px-4 bg-[#98971a] text-[#282828] font-bold uppercase border-2 border-[#3c3836] shadow-[4px_4px_0_0_#3c3836] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-transform text-center"
            >
              {action.text}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

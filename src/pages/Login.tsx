import { useEffect, useState } from "react";
import { useAuthLogin } from "../hooks/useAuthLogin";
import { useNavigate } from "react-router";
import { getFieldErrorMessages } from "../lib/error-utils";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data, error, loading, login } = useAuthLogin();
  const { setAccessToken } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  useEffect(() => {
    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      navigate("/");
    }
  }, [data, setAccessToken, navigate]);

  const fieldLabelMap = { email: "Email", password: "Password" };
  const fieldErrors = getFieldErrorMessages(error, fieldLabelMap);

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-[#d5c4a1] border-4 border-[#3c3836] shadow-[8px_8px_0_0_#3c3836]">
      <h1 className="text-3xl font-extrabold uppercase text-[#3c3836] text-center border-b-4 border-[#3c3836] pb-4 mb-8">
        Authenticate
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block mb-1 font-bold text-xs uppercase text-[#928374]"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-[#fbf1c7] border-2 border-[#3c3836] focus:outline-none focus:border-[#458588] focus:ring-0 text-[#3c3836]"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-1 font-bold text-xs uppercase text-[#928374]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-[#fbf1c7] border-2 border-[#3c3836] focus:outline-none focus:border-[#458588] focus:ring-0 text-[#3c3836]"
          />
        </div>

        {error && (
          <div className="p-3 border-2 border-[#cc241d] bg-[#fbf1c7] text-[#cc241d] font-bold space-y-1 text-sm">
            {error.message && <p>{error.message}</p>}
            {fieldErrors.map((msg, idx) => (
              <p key={idx}>{msg}</p>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-[#98971a] text-[#282828] font-bold uppercase border-2 border-[#3c3836] shadow-[4px_4px_0_0_#3c3836] enabled:hover:shadow-none enabled:hover:translate-x-1 enabled:hover:translate-y-1 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Login"}
        </button>
      </form>
    </div>
  );
}

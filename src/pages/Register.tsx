import { useEffect, useState } from "react";
import { useAuthRegister } from "../hooks/useAuthRegister";
import { useNavigate } from "react-router";

export function Register() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const { register, data, loading, error } = useAuthRegister();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ name: fullName, email, password });
  };

  useEffect(() => {
    if (data?.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      navigate("/");
    }
  }, [data, navigate]);

  return (
    <div className="max-w-md mx-auto mt-12 bg-[#f9f5d7] text-[#3c3836] p-8 rounded-xl shadow-lg border border-[#d5c4a1]">
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 bg-white text-[#3c3836] border border-[#d5c4a1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#d5c4a1]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-white text-[#3c3836] border border-[#d5c4a1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#d5c4a1]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-white text-[#3c3836] border border-[#d5c4a1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#d5c4a1]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-[#d5c4a1] hover:bg-[#bdae93] text-[#3c3836] font-semibold rounded-md transition"
        >
          {loading ? "Register...." : "Register"}
        </button>

        {error && <div className="text-red-600">{error.message}</div>}
        {data?.accessToken && (
          <div className="text-green-600">Success. Token saved.</div>
        )}
      </form>
    </div>
  );
}

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { ApiError, type AuthResponse } from "../lib/api.types";

export function Register() {
  const [register, setRegister] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  const { mutate, error, isPending } = useMutation({
    mutationFn: async (payload: typeof register) => {
      return await api.post<AuthResponse>("/auth/register", {
        name: payload.fullName,
        email: payload.email,
        password: payload.email,
      });
    },

    onSuccess: (res) => {
      setAccessToken(res.data.accessToken);
      navigate("/");
    },

    onError: (err) => {
      if (err instanceof ApiError) {
        const { statusCode, message } = err.response;

        console.log(statusCode, message);

        if ("errors" in err.response) {
          const fieldErrors = err.response.errors.fieldErrors;
          console.log(fieldErrors);
        }
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(register);
  };

  const fieldLabelMap: Record<string, string> = {
    name: "Full Name",
    email: "Email",
    password: "Password",
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-[#d5c4a1] border-4 border-[#3c3836] shadow-[8px_8px_0_0_#3c3836]">
      <h1 className="text-3xl font-extrabold uppercase text-[#3c3836] text-center border-b-4 border-[#3c3836] pb-4 mb-8">
        Create Account
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="fullName"
            className="block mb-1 font-bold text-xs uppercase text-[#928374]"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={register.fullName}
            onChange={(e) =>
              setRegister({ ...register, fullName: e.target.value })
            }
            className="w-full p-3 bg-[#fbf1c7] border-2 border-[#3c3836] focus:outline-none focus:border-[#458588] focus:ring-0 text-[#3c3836]"
          />
        </div>
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
            value={register.email}
            onChange={(e) =>
              setRegister({ ...register, email: e.target.value })
            }
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
            value={register.password}
            onChange={(e) =>
              setRegister({ ...register, password: e.target.value })
            }
            className="w-full p-3 bg-[#fbf1c7] border-2 border-[#3c3836] focus:outline-none focus:border-[#458588] focus:ring-0 text-[#3c3836]"
          />
        </div>

        {error instanceof ApiError && (
          <div className="p-4 border border-[#cc241d] bg-[#fbf1c7] text-[#cc241d] rounded-md space-y-1 text-sm font-medium">
            {"errors" in error.response &&
            Object.keys(error.response.errors.fieldErrors).length > 0 ? (
              Object.entries(error.response.errors.fieldErrors).map(
                ([field, messages]) =>
                  messages.map((msg, i) => (
                    <p key={`${field}-${i}`}>
                      •{" "}
                      <span className="capitalize">
                        {fieldLabelMap[field] ?? field}
                      </span>
                      : {msg}
                    </p>
                  )),
              )
            ) : (
              <p className="capitalize">• {error.response.message}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-4 bg-[#b16286] text-[#fbf1c7] font-bold uppercase border-2 border-[#3c3836] shadow-[4px_4px_0_0_#3c3836] enabled:hover:shadow-none enabled:hover:translate-x-1 enabled:hover:translate-y-1 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Processing..." : "Register"}
        </button>
      </form>
    </div>
  );
}

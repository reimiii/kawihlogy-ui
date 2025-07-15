import { useEffect } from "react";
import { useNavigate } from "react-router";
import { JournalList } from "../components/JournalList";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../hooks/useProfile";
import { ApiError } from "../lib/api.types";

export function Profile() {
  const { accessToken, isInitialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && !accessToken) {
      navigate("/login");
    }
  }, [isInitialized, accessToken, navigate]);

  const { data, isPending, error } = useProfile(
    isInitialized && accessToken ? accessToken : "",
  );

  useEffect(() => {
    if (error instanceof ApiError && error.response.statusCode === 401) {
      navigate("/login");
    }
  }, [error, navigate]);

  if (!isInitialized) return null;
  if (!accessToken) return null;

  if (isPending) {
    return (
      <div className="p-4 uppercase font-bold text-[#928374]">
        Loading Profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 font-bold text-[#cc241d] bg-[#fbf1c7] border-4 border-[#3c3836]">
        Error: {error?.message ?? "Failed to load profile"}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 font-bold uppercase text-[#3c3836]">
        No Profile Data.
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column: Profile Card */}
      <div className="lg:w-1/3 flex-shrink-0">
        <div className="bg-[#d5c4a1] border-4 border-[#3c3836] p-6 shadow-[8px_8px_0_0_#3c3836]">
          <h1 className="text-2xl font-extrabold uppercase text-[#3c3836] border-b-4 border-[#3c3836] pb-3 mb-6">
            User Profile
          </h1>
          <div className="space-y-4 text-base">
            <div>
              <span className="block text-[#928374] uppercase text-xs font-bold">
                Name
              </span>
              <p className="font-bold text-[#3c3836] text-lg">{data.name}</p>
            </div>
            <div>
              <span className="block text-[#928374] uppercase text-xs font-bold">
                Email
              </span>
              <p className="font-bold text-[#3c3836] text-lg">{data.email}</p>
            </div>
            <div>
              <span className="block text-[#928374] uppercase text-xs font-bold">
                Role
              </span>
              <p className="font-bold text-[#3c3836] text-lg">{data.role}</p>
            </div>
            <div>
              <span className="block text-[#928374] uppercase text-xs font-bold">
                Identifier
              </span>
              <p className="font-mono text-sm text-[#3c3836] break-all">
                {data.id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: User's Journal List */}
      <div className="lg:w-2/3 pr-4">
        {data?.id && <JournalList userId={data.id} />}
      </div>
    </div>
  );
}

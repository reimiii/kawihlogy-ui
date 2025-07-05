import { useEffect } from "react";
import { useNavigate } from "react-router";
import { JournalList } from "../components/JournalList";
import { useProfile } from "../hooks/useProfile";

export function Profile() {
  const { data, loading, error } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (error?.statusCode === 401) {
      navigate("/login");
    }
  }, [error, navigate]);

  if (loading) {
    return <div className="text-[#3c3836] p-4">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        Error: {error?.message ?? "Failed to load profile"} {error?.statusCode}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-[#3c3836] p-4">
        No profile data available. login or register
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf1c7] text-[#3c3836] font-mono flex flex-col">
      <div className="sticky top-0 z-10 bg-[#fbf1c7] border-b border-[#d5c4a1] px-8 py-4">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto">
        {/* Left: Profile */}
        <div className="w-full lg:w-1/2 p-6 border-r border-[#d5c4a1]">
          {loading && <div>Loading profile...</div>}
          {error && <div className="text-red-600">Error: {error.message}</div>}
          {data && (
            <div className="bg-[#f2e5bc] border-4 border-[#d5c4a1] p-8">
              <h2 className="text-2xl font-bold text-[#d65d0e] mb-4 border-b border-[#d5c4a1] pb-2">
                User Profile
              </h2>
              <div className="space-y-3">
                <div className="bg-[#ebdbb2] px-4 py-2 border border-[#d5c4a1] font-bold">
                  <span className="text-[#458588]">Name:</span> {data.name}
                </div>
                <div className="bg-[#ebdbb2] px-4 py-2 border border-[#d5c4a1] font-bold">
                  <span className="text-[#458588]">Email:</span> {data.email}
                </div>
                <div className="bg-[#ebdbb2] px-4 py-2 border border-[#d5c4a1] font-bold">
                  <span className="text-[#458588]">/R/:</span> {data.role}
                </div>
                <div className="bg-[#ebdbb2] px-4 py-2 border border-[#d5c4a1] font-bold">
                  <span className="text-[#458588]">Identifier:</span> {data.id}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Journal List */}
        <div className="w-full lg:w-1/2 border-l border-[#d5c4a1]">
          {data?.id && <JournalList userId={data.id} />}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useJournalList } from "../hooks/useJournalPaginate";

export function Home() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useJournalList({ page, size: 10 });

  if (loading) return <div className="text-[#3c3836] p-4">Loading...</div>;
  if (error)
    return <div className="text-red-600 p-4">Error: {error.message}</div>;

  const journals = data?.items ?? [];
  const meta = data?.meta;

  return (
    <div className="min-h-screen bg-[#fbf1c7] text-[#3c3836] font-mono flex flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-[#fbf1c7] border-b border-[#d5c4a1] px-8 py-4">
        <h1 className="text-2xl font-bold">Journal List</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-8 py-4 space-y-4">
        <ul className="space-y-4">
          {journals.map((journal) => (
            <li
              key={journal.id}
              className="p-4 border border-[#d5c4a1] rounded-md shadow-sm bg-[#f2e5bc] hover:bg-[#ebdbb2] transition"
            >
              <h2 className="text-xl font-semibold text-[#d65d0e]">
                {journal.title ?? "(untitled)"}
              </h2>
              <p className="mt-2">{journal.content}</p>
              <div className="mt-3 text-sm text-[#665c54] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#458588]">
                    {journal.user?.name ?? "Unknown"}
                  </span>
                  <span className="text-xs text-[#928374]">
                    {new Date(
                      journal.date ?? journal.createdAt ?? "",
                    ).toLocaleDateString()}
                  </span>
                </div>
                {journal.isPrivate && (
                  <span className="text-[#cc241d] font-bold">[Private]</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pagination Controls */}
      <div className="px-8 py-4 border-t border-[#d5c4a1] bg-[#fbf1c7]">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!meta?.hasPrev}
            className={`px-4 py-2 rounded bg-[#d79921] text-white hover:bg-[#b57614] transition ${
              !meta?.hasPrev ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Previous
          </button>

          <span className="text-[#3c3836] font-medium">
            Page {meta?.page} of {meta?.lastPage}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!meta?.hasNext}
            className={`px-4 py-2 rounded bg-[#d79921] text-white hover:bg-[#b57614] transition ${
              !meta?.hasNext ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

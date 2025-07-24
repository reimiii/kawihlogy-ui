import { useState } from "react";
import { Link, useParams } from "react-router";
import { useJournals } from "../hooks/useJournals";
import { SkeletonBlock } from "./SkeletonBox";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";

const EmptyState = ({
  message,
  subtext,
}: {
  message: string;
  subtext: string;
}) => (
  <div className="text-center border-4 border-dashed border-[#928374] p-12 bg-[#fbf1c7]">
    <h2 className="text-2xl font-extrabold uppercase text-[#3c3836]">
      {message}
    </h2>
    <p className="mt-2 text-sm text-[#928374] uppercase tracking-wider">
      {subtext}
    </p>
  </div>
);

export function JournalList({ userId: propUserId }: { userId?: string }) {
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const userId = propUserId || paramUserId;

  const { accessToken, isInitialized } = useAuth();

  const [page, setPage] = useState(1);
  const { data, isPending, error } = useJournals({
    page,
    size: 5,
    uuid: userId,
    token: isInitialized && accessToken ? accessToken : undefined,
  });

  if (isPending) return <SkeletonBlock />;

  if (error)
    return (
      <div className="p-4 font-bold text-[#cc241d] bg-[#fbf1c7] border-4 border-[#3c3836]">
        ERROR: {error.message}
      </div>
    );

  const journals = data?.items ?? [];
  const meta = data?.meta;
  const [first] = journals;

  return (
    <div className="space-y-8">
      {/* Header */}
      {/* Header */}
      <div className="bg-[#d5c4a1] border-4 border-[#3c3836] p-4 shadow-[4px_4px_0_0_#3c3836]">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold uppercase text-[#3c3836]">
              Journals
            </h1>
            <p className="text-[#3c3836] text-sm mt-1 uppercase">
              {userId ? (
                first ? (
                  <>
                    Showing journals by{" "}
                    <span className="font-bold text-[#458588]">
                      {first.user?.name ?? "Unknown"}
                    </span>
                  </>
                ) : (
                  <>No journals found for this user</>
                )
              ) : (
                <>Public journals from various users</>
              )}
            </p>
          </div>
          <Link
            to="/about"
            className="bg-[#b16286] text-[#fbf1c7] px-3 py-1 font-bold uppercase border-2 border-[#3c3836] shadow-[2px_2px_0_0_#3c3836] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-sm"
          >
            About
          </Link>
        </div>
      </div>

      {/* Content */}

      {journals.length === 0 ? (
        <EmptyState
          message="No Entries Found"
          subtext={
            userId
              ? `This user has not created any journals yet.`
              : "There are currently no public journals to display."
          }
        />
      ) : (
        <>
          <ul className="space-y-6">
            {journals.map((journal) => (
              <li
                key={journal.id}
                className="p-4 border-4 border-[#3c3836] shadow-[4px_4px_0_0_#3c3836] bg-[#ebdbb2] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-transform"
              >
                <Link
                  to={`/journals/${journal.id}`}
                  className="block text-xl font-extrabold text-[#b16286] hover:underline uppercase truncate"
                >
                  {journal.title || "(Untitled)"}
                </Link>

                <p className="mt-2 text-sm text-[#3c3836] leading-relaxed break-words line-clamp-4">
                  {journal.content}
                </p>

                <div className="mt-2 flex flex-wrap gap-2 text-xs uppercase text-[#3c3836]">
                  {journal.topics.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="font-bold text-[0.7rem]">Topics:</span>
                      {journal.topics.slice(0, 4).map((topic, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-[2px] bg-[#d5c4a1] text-[#282828] border border-[#3c3836] text-[0.6rem] font-bold"
                        >
                          {topic}
                        </span>
                      ))}
                      {journal.topics.length > 4 && (
                        <span className="px-1.5 py-[2px] bg-[#d5c4a1] text-[#282828] border border-[#3c3836] text-[0.6rem] font-bold">
                          ...
                        </span>
                      )}
                    </div>
                  )}
                  {journal.emotions.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="font-bold text-[0.7rem]">Emotions:</span>
                      {journal.emotions.slice(0, 4).map((emotion, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-[2px] bg-[#fabd2f] text-[#282828] border border-[#3c3836] text-[0.6rem] font-bold"
                        >
                          {emotion}
                        </span>
                      ))}
                      {journal.emotions.length > 4 && (
                        <span className="px-1.5 py-[2px] bg-[#fabd2f] text-[#282828] border border-[#3c3836] text-[0.6rem] font-bold">
                          ...
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-2 border-t-4 border-[#928374] text-xs text-[#3c3836] flex justify-between items-center">
                  <div className="flex items-center gap-4 uppercase">
                    <Link
                      to={`/f/${journal.user?.id}/journals`}
                      className="font-bold text-[#458588] hover:underline"
                    >
                      {journal.user?.name || "Unknown"}
                    </Link>
                    <span className="text-[#928374]">
                      {dayjs(journal.date || journal.createdAt).format(
                        "MMM D, YYYY",
                      )}
                    </span>
                    {journal.updatedAt !== journal.createdAt && (
                      <span className="text-[#689d6a] font-bold">Updated</span>
                    )}
                  </div>
                  {journal.isPrivate && (
                    <span className="font-extrabold text-[#cc241d] tracking-widest">
                      PRIVATE
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {meta && meta.lastPage > 1 && (
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!meta?.hasPrev}
                className="px-4 py-2 font-bold uppercase border-2 border-[#3c3836] bg-[#98971a] text-[#282828] shadow-[2px_2px_0_0_#3c3836] enabled:hover:shadow-none enabled:hover:translate-x-0.5 enabled:hover:translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="text-[#3c3836] font-bold uppercase">
                Page {meta?.page} of {meta?.lastPage}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!meta?.hasNext}
                className="px-4 py-2 font-bold uppercase border-2 border-[#3c3836] bg-[#98971a] text-[#282828] shadow-[2px_2px_0_0_#3c3836] enabled:hover:shadow-none enabled:hover:translate-x-0.5 enabled:hover:translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

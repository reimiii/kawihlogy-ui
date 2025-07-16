import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { SkeletonBlock } from "../components/SkeletonBox";
import { useAuth } from "../context/AuthContext";
import { useJournal } from "../hooks/useJournal";
import { useProfile } from "../hooks/useProfile";
import { api } from "../lib/api";

export function JournalDetail() {
  const { uuid } = useParams<{ uuid: string }>();
  const { accessToken, isInitialized } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isJournalDeleteModalOpen, setJournalDeleteModalOpen] = useState(false);
  const [isAudioDeleteModalOpen, setAudioDeleteModalOpen] = useState(false);
  const [isPoemDeleteModalOpen, setPoemDeleteModalOpen] = useState(false);
  const [textSize, setTextSize] = useState<"text-base" | "text-lg" | "text-xl">(
    "text-lg",
  );

  const { data, error, isPending } = useJournal({
    uuid: uuid ? uuid : "",
    token: isInitialized && accessToken ? accessToken : "",
  });

  const { data: currentUser } = useProfile(
    isInitialized && accessToken ? accessToken : "",
  );

  const deleteJournalMutation = useMutation({
    mutationFn: async () => {
      return await api.delete(`/journal/${uuid}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    },
    onSuccess: () => navigate("/p"),
    onError: () => setJournalDeleteModalOpen(false),
  });

  const deletePoemMutation = useMutation({
    mutationFn: async () => {
      if (!data?.poem?.id) throw new Error("Missing poem ID");
      return await api.delete(`/poem/${data.poem.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["journal", uuid, accessToken],
      });
      setPoemDeleteModalOpen(false);
    },
    onError: () => setPoemDeleteModalOpen(false),
  });

  const deleteAudioMutation = useMutation({
    mutationFn: async () => {
      if (!data?.poem?.id) throw new Error("Missing poem ID");
      return await api.delete(`/poem/${data.poem.id}/file`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["journal", uuid, accessToken],
      });
      setAudioDeleteModalOpen(false);
    },
    onError: () => setAudioDeleteModalOpen(false),
  });

  if (isPending) {
    return <SkeletonBlock />;
  }

  if (error)
    return (
      <div className="p-4 border-4 border-[#3c3836] bg-[#d5c4a1] text-[#cc241d] font-bold uppercase">
        ERROR: {error.message}
      </div>
    );

  if (!data)
    return (
      <div className="p-4 border-4 border-[#3c3836] bg-[#d5c4a1] text-[#928374] font-bold uppercase">
        JOURNAL NOT FOUND.
      </div>
    );

  const { title, content, user, date, isPrivate, poem } = data;
  const isOwner = currentUser?.id === user?.id;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-4 border-[#3c3836] bg-[#d5c4a1] p-4">
          {isPrivate && (
            <p className="font-extrabold text-[#cc241d] tracking-widest uppercase">
              [Private]
            </p>
          )}
          <h1 className="text-4xl font-extrabold uppercase text-[#3c3836] break-words whitespace-pre-wrap">
            {title ?? "(Untitled)"}
          </h1>
          <div className="mt-2 pt-2 border-t-2 border-[#928374] text-xs uppercase text-[#3c3836] font-bold">
            <span>By: {user?.name ?? "Unknown"}</span> /{" "}
            <span>On: {new Date(date ?? "").toLocaleDateString()}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#3c3836] uppercase">
              Emotions:
            </span>
            {data.emotions?.map((emotion: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-1 bg-[#fb4934] text-[#fbf1c7] border-2 border-[#3c3836] text-xs uppercase font-bold"
              >
                {emotion}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#3c3836] uppercase">Topics:</span>
            {data.topics?.map((topic: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-1 bg-[#b8bb26] text-[#282828] border-2 border-[#3c3836] text-xs uppercase font-bold"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        {isOwner && (
          <div className="flex flex-wrap gap-4 border-4 border-[#3c3836] bg-[#d5c4a1] p-4">
            <button
              disabled={!!poem?.content}
              className="px-4 py-2 font-bold uppercase border-2 border-[#3c3836] bg-[#458588] text-[#fbf1c7] shadow-[2px_2px_0_0_#3c3836] enabled:hover:shadow-none enabled:hover:translate-x-0.5 enabled:hover:translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#928374]"
            >
              {poem?.content ? "Poem Generated" : "Generate Poem"}
            </button>
            <button
              disabled={!poem?.content || !!poem?.file}
              className="px-4 py-2 font-bold uppercase border-2 border-[#3c3836] bg-[#b16286] text-[#fbf1c7] shadow-[2px_2px_0_0_#3c3836] enabled:hover:shadow-none enabled:hover:translate-x-0.5 enabled:hover:translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#928374]"
            >
              {poem?.file ? "Audio Generated" : "Generate Audio"}
            </button>

            <div className="ml-auto flex gap-4">
              <Link
                to={`/journals/${uuid}/update`}
                className="px-4 py-2 font-bold uppercase border-2 border-[#3c3836] bg-[#d79921] text-[#282828] shadow-[2px_2px_0_0_#3c3836] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
              >
                Update Journal
              </Link>
              <button
                onClick={() => setJournalDeleteModalOpen(true)}
                className="px-4 py-2 font-bold uppercase border-2 border-[#3c3836] bg-[#cc241d] text-[#fbf1c7] shadow-[2px_2px_0_0_#3c3836] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
              >
                Delete Journal
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mb-2">
          <button
            onClick={() => setTextSize("text-base")}
            className={`px-2 py-1 text-xs font-bold uppercase border-2 border-[#3c3836] bg-[#b8bb26] text-[#282828] shadow-[2px_2px_0_0_#3c3836] transition-transform
              ${
                textSize === "text-base"
                  ? "translate-x-0.5 translate-y-0.5 shadow-none"
                  : "hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              }
            `}
          >
            A-
          </button>

          <button
            onClick={() => setTextSize("text-lg")}
            className={`px-2 py-1 text-xs font-bold uppercase border-2 border-[#3c3836] bg-[#d79921] text-[#3c3836] shadow-[2px_2px_0_0_#3c3836] transition-transform
              ${
                textSize === "text-lg"
                  ? "translate-x-0.5 translate-y-0.5 shadow-none"
                  : "hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              }
            `}
          >
            A
          </button>

          <button
            onClick={() => setTextSize("text-xl")}
            className={`px-2 py-1 text-xs font-bold uppercase border-2 border-[#3c3836] bg-[#cc241d] text-[#fbf1c7] shadow-[2px_2px_0_0_#3c3836] transition-transform
              ${
                textSize === "text-xl"
                  ? "translate-x-0.5 translate-y-0.5 shadow-none"
                  : "hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              }
            `}
          >
            A+
          </button>
        </div>
        {/* Content */}
        <div
          className={`leading-relaxed whitespace-pre-wrap break-words border-4 border-[#3c3836] bg-[#d5c4a1] p-4 text-[#3c3836] max-w-full ${textSize}`}
        >
          {content}
        </div>

        {/* Poem and Sticky Audio Player Section */}
        {poem?.content?.stanzas && (
          <>
            <div className="border-4 border-[#3c3836] bg-[#d5c4a1] p-4 mt-8">
              <div className="flex items-center justify-between border-b-4 border-[#928374] pb-2 mb-6">
                <h1 className="text-2xl font-extrabold uppercase text-[#3c3836]">
                  Generated Poem
                </h1>

                {isOwner && (
                  <button
                    onClick={() => setPoemDeleteModalOpen(true)}
                    className="px-4 py-2 text-base font-extrabold uppercase border-2 border-[#3c3836] bg-[#d79921] text-[#3c3836] shadow-[2px_2px_0_0_#3c3836] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
                  >
                    Delete Poem
                  </button>
                )}
              </div>

              {/* This player is now sticky */}
              {poem?.file?.url && (
                <div className="sticky top-0 z-10 bg-[#3c3836] text-[#ebdbb2] p-3 border-2 border-[#928374] mb-6 overflow-x-auto">
                  <div className="flex items-center justify-between gap-4">
                    <div className="font-mono text-sm uppercase font-bold truncate">
                      Audio: {poem.file.originalName}
                    </div>

                    <div className="flex-1 min-w-0 flex items-center gap-4 justify-end">
                      <audio controls className="w-full h-8">
                        <source src={poem.file.url} type={poem.file.mimeType} />
                        AUDIO NOT SUPPORTED.
                      </audio>

                      {isOwner && (
                        <button
                          onClick={() => setAudioDeleteModalOpen(true)}
                          className="px-4 py-2 text-sm font-bold uppercase border-2 border-[#3c3836] bg-[#b8bb26] text-[#282828] shadow-[2px_2px_0_0_#3c3836] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-transform shrink-0"
                        >
                          Delete Audio
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div
                className={`space-y-6 font-mono text-[#3c3836] ${
                  textSize === "text-xl"
                    ? "text-2xl"
                    : textSize === "text-lg"
                      ? "text-xl"
                      : textSize === "text-base"
                        ? "text-lg"
                        : textSize
                }`}
              >
                {poem.content.stanzas.map((stanza, i) => (
                  <div
                    key={i}
                    className="pl-4 border-l-4 border-[#928374] space-y-1"
                  >
                    {stanza.map((line, j) => (
                      <p
                        key={j}
                        className="whitespace-pre-wrap leading-relaxed"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={isJournalDeleteModalOpen}
        onClose={() => setJournalDeleteModalOpen(false)}
        onConfirm={() => deleteJournalMutation.mutate()}
        isPending={deleteJournalMutation.isPending}
        title="Confirm Journal Deletion"
        message={
          <p>
            This action is irreversible. The <strong>entire journal</strong>,
            including its generated poem and audio file, will be permanently
            deleted.
          </p>
        }
      />

      <DeleteConfirmationModal
        isOpen={isAudioDeleteModalOpen}
        onClose={() => setAudioDeleteModalOpen(false)}
        onConfirm={() => deleteAudioMutation.mutate()}
        isPending={deleteAudioMutation.isPending}
        title="Confirm Audio Deletion"
        message={
          <p>
            This will permanently delete <strong>only the audio file</strong>.
            The journal entry and the poem text will remain.
          </p>
        }
      />

      <DeleteConfirmationModal
        isOpen={isPoemDeleteModalOpen}
        onClose={() => setPoemDeleteModalOpen(false)}
        onConfirm={() => deletePoemMutation.mutate()}
        isPending={deletePoemMutation.isPending}
        title="Confirm Poem Deletion"
        message={
          <p>
            This will permanently delete the{" "}
            <strong>generated poem and audio (if any)</strong>. The journal
            entry will remain.
          </p>
        }
      />
    </>
  );
}

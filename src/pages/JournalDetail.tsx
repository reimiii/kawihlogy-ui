import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { SkeletonBlock } from "../components/SkeletonBox";
import { useAuth } from "../context/AuthContext";
import { useJournal } from "../hooks/useJournal";
import { useProfile } from "../hooks/useProfile";
import { api } from "../lib/api";
import type {
  JobEvent,
  JobProgress,
  JoinRoomResponse,
} from "../lib/socket.types";
import { socket } from "../lib/socket";
import { BaseModal } from "../components/BaseModal";

export function JournalDetail() {
  const { uuid } = useParams<{ uuid: string }>();
  const { accessToken, isInitialized } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isJournalDeleteModalOpen, setJournalDeleteModalOpen] = useState(false);
  const [isAudioDeleteModalOpen, setAudioDeleteModalOpen] = useState(false);
  const [isPoemDeleteModalOpen, setPoemDeleteModalOpen] = useState(false);

  const [isPoemProgressModalOpen, setPoemProgressModalOpen] = useState(false);
  const [isAudioProgressModalOpen, setAudioProgressModalOpen] = useState(false);

  const [poemProgress, setPoemProgress] = useState<JobProgress[]>([
    {
      status: "idle",
      message: "Ready to generate poem",
      timestamp: new Date().toISOString(),
    },
  ]);

  const [audioProgress, setAudioProgress] = useState<JobProgress[]>([
    {
      status: "idle",
      message: "Ready to generate audio",
      timestamp: new Date().toISOString(),
    },
  ]);

  const [poemJobId, setPoemJobId] = useState<string | null>(null);
  const [audioJobId, setAudioJobId] = useState<string | null>(null);

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

  const generatePoemMutation = useMutation({
    onMutate: () => {
      const id = `poetry:text:${uuid}`;
      setPoemJobId(id);
      socket.emit("poem:join", { jobId: id });
      setPoemProgress([
        {
          status: "idle",
          message: "Ready to generate poem",
          timestamp: new Date().toISOString(),
        },
        {
          status: "added",
          message: "Poem generation started",
          timestamp: new Date().toISOString(),
        },
      ]);
      setPoemProgressModalOpen(true);
    },
    mutationFn: async () => {
      if (!uuid) throw new Error("Missing journal ID");
      const response = await api.post<{ jobId: string; state: string }>(
        `/poem`,
        { journalId: uuid },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      return response.data;
    },
    onError: (error) => {
      setPoemProgress((prev) => [
        ...prev,
        {
          status: "failed",
          message: `Generation failed: ${error.message}`,
          timestamp: new Date().toISOString(),
        },
      ]);
      setPoemProgressModalOpen(true);
    },
  });

  const updateProgress = (
    jobId: string,
    event: JobEvent | JoinRoomResponse,
    progress: JobProgress[],
    setProgress: (progress: JobProgress[]) => void,
    setModalOpen: (open: boolean) => void,
    queryClient: ReturnType<typeof useQueryClient>,
    uuid: string | undefined,
    accessToken: string | null,
  ) => {
    const messages: Record<string, string> = {
      joined: "Joined processing room",
      added: "Job added to queue",
      active: "Processing...",
      waiting: "Job waiting in queue",
      failed: `Job failed: ${(event as JobEvent).reason || "Unknown error"}`,
      completed: "Job completed successfully",
    };
    setProgress([
      ...progress,
      {
        status: event.type,
        message: messages[event.type],
        timestamp: new Date().toISOString(),
      },
    ]);
    if (event.type === "completed" || event.type === "failed") {
      console.log("WWWWWWOOOOWWW", jobId);
      queryClient.invalidateQueries({
        queryKey: ["journal", uuid, accessToken],
      });
      setTimeout(() => {
        setModalOpen(false);
        // Clear progress if needed
        setProgress([]);
      }, 2000);
    }
  };

  const eventMutation = useMutation({
    mutationFn: async (
      event: JobEvent | (JoinRoomResponse & { jobId: string }),
    ) => event,
    onSuccess: (event) => {
      console.log("on success event mutate: ", JSON.stringify(event));
      if (event.jobId === poemJobId) {
        updateProgress(
          poemJobId!,
          event,
          poemProgress,
          setPoemProgress,
          setPoemProgressModalOpen,
          queryClient,
          uuid,
          accessToken,
        );
      } else if (event.jobId === audioJobId) {
        updateProgress(
          audioJobId!,
          event,
          audioProgress,
          setAudioProgress,
          setAudioProgressModalOpen,
          queryClient,
          uuid,
          accessToken,
        );
      }
    },
  });

  useEffect(() => {
    if (!poemJobId) return;
    if (!socket.connected) socket.connect();

    const handleConnect = () => {
      console.log("socket connected", socket.id);
    };

    // Handler untuk disconnect
    const handleDisconnect = (reason: string) => {
      console.log("socket disconnected, reason:", reason);

      // Contoh: Jika disconnect karena intentional
      if (reason === "io client disconnect") {
        console.log("Disconnect dipanggil manual oleh client");
      }
    };

    // Pasang event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    const jobIds = [poemJobId].filter((id): id is string => !!id);

    console.log(jobIds);

    jobIds.forEach((jobId) => {
      socket.on(jobId, (data: JoinRoomResponse) => {
        console.log("on job id", JSON.stringify(data));
        eventMutation.mutate({ ...data, jobId });
      });

      socket.on(`job:complete`, (data: { type: string }) => {
        console.log("complete event", data);
      });

      const events: JobEvent["type"][] = [
        "added",
        "active",
        "waiting",
        "failed",
        "completed",
      ];
      events.forEach((eventType) => {
        socket.on(`job:${eventType}`, (data: JobEvent) => {
          console.log("on job event", JSON.stringify(data));
          eventMutation.mutate({ ...data, jobId });
          if (eventType === "completed") {
            console.log("COMPLETE WOI");
            socket.off(jobId);
            events.forEach((e) => socket.off(`job:${e}`));
            if (jobId.includes("poetry:text:")) {
              setPoemJobId(null);
            } else if (jobId.includes("poetry:audio:")) {
              setAudioJobId(null);
            }
            socket.disconnect();
            console.log("JOB id", jobId);
          }
        });
      });
    });

    return () => {
      // jobIds.forEach((jobId) => {
      //   socket.off(jobId);
      //   const events: JobEvent["type"][] = [
      //     "added",
      //     "active",
      //     "waiting",
      //     "failed",
      //     "completed",
      //   ];
      //   events.forEach((eventType) => socket.off(`job:${eventType}`));
      // });
      // socket.disconnect();
    };
  }, [poemJobId, audioJobId, eventMutation]);

  if (isPending) {
    return <SkeletonBlock lines={10} />;
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
              onClick={() => {
                const isInProgress = poemProgress.some((p) =>
                  ["added", "active", "waiting"].includes(p.status),
                );

                const isFailed = poemProgress.some(
                  (p) => p.status === "failed",
                );

                if (isInProgress) {
                  console.log("masih inprogress?");
                  setPoemProgressModalOpen(true);
                  return;
                }

                if (poem?.content || generatePoemMutation.isPending) return;

                if (poemJobId && !isFailed) {
                  // job sedang jalan, bukan failed
                  return;
                }

                generatePoemMutation.mutate();
              }}
              disabled={!!poem?.content || generatePoemMutation.isPending}
              className="px-4 py-2 font-bold uppercase border-2 border-[#3c3836] bg-[#458588] text-[#fbf1c7] shadow-[2px_2px_0_0_#3c3836] enabled:hover:shadow-none enabled:hover:translate-x-0.5 enabled:hover:translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#928374]"
            >
              {poem?.content
                ? "Poem Generated"
                : generatePoemMutation.isPending
                  ? "Generating..."
                  : "Generate Poem"}
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
      {/* Poem Progress Modal */}
      <BaseModal
        isOpen={isPoemProgressModalOpen}
        onClose={() => {
          const isFail = poemProgress.some((item) => item.status === "failed");
          if (isFail) setPoemProgress([]);
          setPoemProgressModalOpen(false);
        }}
        hideConfirm={true}
        title="Poem Generation Progress"
        message={
          <div className="space-y-2">
            {poemProgress.map((item, index) => (
              <div key={index} className="text-sm">
                <span
                  className={`inline-block w-24 font-medium ${
                    item.status === "failed"
                      ? "text-red-500"
                      : item.status === "completed"
                        ? "text-green-500"
                        : ""
                  }`}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
                <span>{item.message}</span>
                <span className="text-gray-500 ml-2">
                  ({new Date(item.timestamp).toLocaleTimeString()})
                </span>
              </div>
            ))}
          </div>
        }
      />

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

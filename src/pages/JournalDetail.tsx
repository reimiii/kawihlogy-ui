import { useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useJournal } from "../hooks/useJournal";
import { useProfile } from "../hooks/useProfile";

export function JournalDetail() {
  const { uuid } = useParams<{ uuid: string }>();
  const { accessToken, isInitialized } = useAuth();

  const { data, error, isPending } = useJournal({
    uuid: uuid ? uuid : "",
    token: isInitialized && accessToken ? accessToken : "",
  });

  const { data: currentUser } = useProfile(
    isInitialized && accessToken ? accessToken : "",
  );

  if (isPending)
    return (
      <div className="p-4 uppercase font-bold text-[#928374]">LOADING...</div>
    );

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
          </div>
        )}

        {/* Content */}
        <div className="text-base leading-relaxed whitespace-pre-wrap break-words border-4 border-[#3c3836] bg-[#d5c4a1] p-4 text-[#3c3836] max-w-full">
          {content}
        </div>

        {/* Poem and Sticky Audio Player Section */}
        {poem?.content?.stanzas && (
          <div className="border-4 border-[#3c3836] bg-[#d5c4a1] p-4 mt-8">
            <h2 className="text-2xl font-extrabold uppercase text-[#3c3836] border-b-4 border-[#928374] pb-2 mb-6">
              Generated Poem
            </h2>

            {/* This player is now sticky */}
            {poem?.file?.url && (
              <div className="sticky top-0 z-10 bg-[#3c3836] text-[#ebdbb2] p-3 border-2 border-[#928374] mb-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="font-mono text-sm uppercase font-bold truncate">
                    Audio: {poem.file.originalName}
                  </div>
                  <audio controls className="w-full max-w-xs h-10">
                    <source src={poem.file.url} type={poem.file.mimeType} />
                    AUDIO NOT SUPPORTED.
                  </audio>
                </div>
              </div>
            )}

            <div className="space-y-6 font-serif text-lg text-[#3c3836]">
              {poem.content.stanzas.map((stanza, i) => (
                <div key={i} className="pl-4 border-l-4 border-[#928374]">
                  {stanza.map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

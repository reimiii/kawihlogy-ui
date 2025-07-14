import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Env } from "../env";

export default function JournalCreate() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    content: "",
    emotions: "",
    topics: "",
    date: new Date().toISOString().slice(0, 10),
    isPrivate: false,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (payload: typeof form) => {
      const res = await axios.post(
        `${Env.api.baseUrl}/journal`,
        {
          title: payload.title,
          content: payload.content,
          emotions: payload.emotions.split(",").map((e) => e.trim()),
          topics: payload.topics.split(",").map((t) => t.trim()),
          date: dayjs(payload.date).format("YYYY-MM-DD"),
          isPrivate: payload.isPrivate,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return res.data;
    },
    onSuccess: () => {
      setFieldErrors({});
      navigate("/");
    },
    onError: (err) => {
      if (axios.isAxiosError(err) && err.response?.data?.errors?.fieldErrors) {
        setFieldErrors(err.response.data.errors.fieldErrors);
      } else {
        setFieldErrors({});
      }
    },
  });
  const hasFieldErrors = Object.keys(fieldErrors).length > 0;

  return (
    <div className="p-8 bg-[#d5c4a1] border-4 border-[#3c3836] shadow-[8px_8px_0_0_#3c3836]">
      <h1 className="text-3xl font-extrabold uppercase text-[#3c3836] text-left border-b-4 border-[#3c3836] pb-4 mb-8">
        New Journal Entry
      </h1>

      <form className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block mb-1 font-bold text-xs uppercase text-[#928374]"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full p-3 bg-[#fbf1c7] border-2 border-[#3c3836] focus:outline-none focus:border-[#b16286] focus:ring-0"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="block mb-1 font-bold text-xs uppercase text-[#928374]"
          >
            Content
          </label>
          <textarea
            id="content"
            rows={8}
            className="w-full p-3 bg-[#fbf1c7] border-2 border-[#3c3836] focus:outline-none focus:border-[#b16286] focus:ring-0"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>

        {/* Emotions */}
        <div>
          <label
            htmlFor="emotions"
            className="block mb-1 font-bold text-xs uppercase text-[#928374]"
          >
            Emotions (comma separated)
          </label>
          <input
            id="emotions"
            type="text"
            className="w-full p-3 bg-[#fbf1c7] border-2 border-[#3c3836] focus:outline-none focus:border-[#b16286] focus:ring-0"
            value={form.emotions}
            onChange={(e) => setForm({ ...form, emotions: e.target.value })}
          />
        </div>

        {/* Topics */}
        <div>
          <label
            htmlFor="topics"
            className="block mb-1 font-bold text-xs uppercase text-[#928374]"
          >
            Topics (comma separated)
          </label>
          <input
            id="topics"
            type="text"
            className="w-full p-3 bg-[#fbf1c7] border-2 border-[#3c3836] focus:outline-none focus:border-[#b16286] focus:ring-0"
            value={form.topics}
            onChange={(e) => setForm({ ...form, topics: e.target.value })}
          />
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="date"
            className="block mb-1 font-bold text-xs uppercase text-[#928374]"
          >
            Date
          </label>
          <input
            id="date"
            type="date"
            className="w-full p-3 bg-[#fbf1c7] border-2 border-[#3c3836] focus:outline-none focus:border-[#b16286] focus:ring-0"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        {/* Private Toggle */}
        <div className="flex items-center gap-4 p-3 bg-[#fbf1c7] border-2 border-[#3c3836]">
          <input
            id="isPrivate"
            type="checkbox"
            checked={form.isPrivate}
            onChange={(e) => setForm({ ...form, isPrivate: e.target.checked })}
            className="h-5 w-5 bg-[#fbf1c7] border-2 border-[#3c3836] text-[#b16286] focus:ring-0 focus:ring-offset-0"
          />
          <label htmlFor="isPrivate" className="font-bold uppercase text-sm">
            Set as Private
          </label>
        </div>

        {/* Errors */}
        {(hasFieldErrors || error) && (
          <div className="p-3 border-2 border-[#cc241d] bg-[#fbf1c7] text-[#cc241d] font-bold space-y-1 text-sm">
            {Object.values(fieldErrors).map((errors, i) => (
              <p key={i}>- {errors.join(", ")}</p>
            ))}
            {error && !hasFieldErrors && <p>- An unknown error occurred.</p>}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={(e: React.FormEvent) => {
            e.preventDefault();
            mutate(form);
          }}
          disabled={isPending}
          className="w-full py-3 px-4 bg-[#98971a] text-[#282828] font-bold uppercase border-2 border-[#3c3836] shadow-[4px_4px_0_0_#3c3836] enabled:hover:shadow-none enabled:hover:translate-x-1 enabled:hover:translate-y-1 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Save Journal"}
        </button>
      </form>
    </div>
  );
}

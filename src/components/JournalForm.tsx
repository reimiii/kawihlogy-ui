import React from "react";
import { ApiError } from "../lib/api.types";

export interface JournalFormData {
  title: string;
  content: string;
  emotions: string;
  topics: string;
  date: string;
  isPrivate: boolean;
}

interface JournalFormProps {
  initialData: JournalFormData;
  onSubmit: (formData: JournalFormData) => void;
  isPending: boolean;
  error: ApiError | null | Error;
  headerText: string;
  submitButtonText: string;
}

export function JournalForm({
  initialData,
  onSubmit,
  isPending,
  error,
  headerText,
  submitButtonText,
}: JournalFormProps) {
  const [form, setForm] = React.useState<JournalFormData>(initialData);

  React.useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    setForm((prev) => ({
      ...prev,
      [id]: isCheckbox && "checked" in e.target ? e.target.checked : value,
    }));
  };

  return (
    <div className="p-8 bg-[#d5c4a1] border-4 border-[#3c3836] shadow-[8px_8px_0_0_#3c3836]">
      <h1 className="text-3xl font-extrabold uppercase text-[#3c3836] text-left border-b-4 border-[#3c3836] pb-4 mb-8">
        {headerText}
      </h1>
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
      >
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
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 bg-[#fbf1c7] border-2 border-[#3c3836] focus:outline-none focus:border-[#b16286] focus:ring-0"
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
            value={form.content}
            onChange={handleChange}
            className="w-full p-3 bg-[#fbf1c7] border-2 border-[#3c3836] focus:outline-none focus:border-[#b16286] focus:ring-0"
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
          />
        </div>

        {/* Private Toggle */}
        <div className="flex items-center gap-4 p-3 bg-[#fbf1c7] border-2 border-[#3c3836]">
          <input
            id="isPrivate"
            type="checkbox"
            checked={form.isPrivate}
            onChange={handleChange}
            className="h-5 w-5 bg-[#fbf1c7] border-2 border-[#3c3836] text-[#b16286] focus:ring-0 focus:ring-offset-0"
          />
          <label htmlFor="isPrivate" className="font-bold uppercase text-sm">
            Set as Private
          </label>
        </div>

        {/* Error Display */}
        {error instanceof ApiError && (
          <div className="p-3 border-2 border-[#cc241d] bg-[#fbf1c7] text-[#cc241d] font-bold space-y-1 text-sm">
            {"errors" in error.response &&
            Object.keys(error.response.errors.fieldErrors).length > 0 ? (
              Object.entries(error.response.errors.fieldErrors).map(
                ([field, messages]) =>
                  messages.map((msg, i) => (
                    <p key={`${field}-${i}`}>
                      - <span className="capitalize">{field}</span>: {msg}
                    </p>
                  )),
              )
            ) : (
              <p>- {error.response.message}</p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-4 bg-[#98971a] text-[#282828] font-bold uppercase border-2 border-[#3c3836] shadow-[4px_4px_0_0_#3c3836] enabled:hover:shadow-none enabled:hover:translate-x-1 enabled:hover:translate-y-1 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "PROCESSING..." : submitButtonText}
        </button>
      </form>
    </div>
  );
}

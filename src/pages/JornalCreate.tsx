import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { JournalForm, type JournalFormData } from "../components/JournalForm";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function JournalCreate() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (payload: JournalFormData) => {
      const res = await api.post(
        `/journal`,
        {
          ...payload,
          emotions: payload.emotions
            ? payload.emotions.split(",").map((e) => e.trim())
            : [],
          topics: payload.topics
            ? payload.topics.split(",").map((t) => t.trim())
            : [],
          date: dayjs(payload.date).format("YYYY-MM-DD"),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return res.data;
    },
    onSuccess: () => navigate("/p"),
  });

  const initialData: JournalFormData = {
    title: "",
    content: "",
    emotions: "",
    topics: "",
    date: dayjs().format("YYYY-MM-DD"),
    isPrivate: false,
  };

  return (
    <JournalForm
      initialData={initialData}
      onSubmit={mutate}
      isPending={isPending}
      error={error}
      headerText="New Journal Entry"
      submitButtonText="Save Journal"
    />
  );
}

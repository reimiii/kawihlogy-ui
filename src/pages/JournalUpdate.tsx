import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import { type JournalFormData, JournalForm } from "../components/JournalForm";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import type { JournalResponse, PickExcept } from "../lib/api.types";
import dayjs from "dayjs";
import { useProfile } from "../hooks/useProfile";
import Forbidden from "../errors/Forbidden";
import { SkeletonBlock } from "../components/SkeletonBox";

export default function JournalUpdate() {
  const { uuid } = useParams<{ uuid: string }>();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const { data: currentUser } = useProfile(accessToken!);

  const { data: journalData, isFetching } = useQuery({
    queryKey: ["journal", uuid],
    queryFn: async () => {
      const res = await api.get<PickExcept<JournalResponse, "poem">>(
        `/journal/${uuid}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return {
        ...res.data,
        emotions: res.data.emotions.join(", "),
        topics: res.data.topics.join(", "),
      };
    },
    enabled: !!uuid,
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (payload: JournalFormData) => {
      const res = await api.patch(
        `/journal/${uuid}`,
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
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      return res.data;
    },
    onSuccess: () => navigate(`/journals/${uuid}`),
  });

  const isOwner = currentUser?.id === journalData?.user?.id;

  if (isFetching) {
    return <SkeletonBlock />;
  }

  if (!journalData) {
    return (
      <div className="p-4 uppercase font-bold text-[#928374]">
        JOURNAL NOT FOUND.
      </div>
    );
  }

  if (!isOwner) return <Forbidden />;

  return (
    <JournalForm
      initialData={journalData}
      onSubmit={mutate}
      isPending={isPending}
      error={error}
      headerText="Edit Journal Entry"
      submitButtonText="Update Journal"
    />
  );
}

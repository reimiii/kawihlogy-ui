import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { type JournalsResponse } from "../lib/api.types";

export function useJournals({
  page,
  size,
  uuid,
  token,
}: {
  page: number;
  size: number;
  uuid?: string;
  token?: string;
}) {
  return useQuery({
    queryKey: ["journals", page, size, uuid, token],
    queryFn: async () => {
      const res = await api.get<JournalsResponse>(`/journal`, {
        params: {
          page,
          size,
          ...(uuid && { userId: uuid }),
        },
        ...(token && { headers: { Authorization: `Bearer ${token}` } }),
      });
      return res.data;
    },
    enabled: true,
  });
}

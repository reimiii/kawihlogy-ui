import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { ApiError, type JournalResponse } from "../lib/api.types";

export function useJournal({ uuid, token }: { uuid: string; token: string }) {
  return useQuery({
    queryKey: ["journal", uuid, token],
    queryFn: async () => {
      const res = await api.get<JournalResponse>(`/journal/${uuid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    retry: (failureCount, err) => {
      if (err instanceof ApiError && err.response.statusCode === 404)
        return false;
      return failureCount < 3;
    },
    enabled: !!uuid && !!token,
  });
}

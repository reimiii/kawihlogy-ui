import { useEffect, useState } from "react";
import type { JournalGet200Response, JournalGetRequest } from "../api";
import { api } from "../api/config";

interface UseJournalListResult {
  data: JournalGet200Response | null;
  loading: boolean;
  error: Error | null;
}
export function useJournalList({
  page = 1,
  size = 10,
  userId,
}: JournalGetRequest): UseJournalListResult {
  const [data, setData] = useState<JournalGet200Response | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    api
      .journalGet({ page, size, userId })
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err: any) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [page, size, userId]);

  return { data, loading, error };
}

import { useEffect, useState } from "react";
import { ResponseError, type AuthProfileGet200Response } from "../api";
import { api } from "../api/config";
import { useAuth } from "../context/AuthContext";

interface UseProfileResult {
  loading: boolean;
  error: Error | null | any;
  data: AuthProfileGet200Response | null;
}
export function useProfile(): UseProfileResult {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | any | null>(null);
  const [data, setData] = useState<AuthProfileGet200Response | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    let isMounted = true;

    setLoading(true);
    setError(null);
    setData(null);

    api
      .authProfileGet({
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        if (!isMounted) return;
        setData(res);
      })
      .catch((err) => {
        if (!isMounted) return;

        if (err instanceof ResponseError) {
          err.response.json().then((json) => {
            if (!isMounted) return;
            setError(new Error(JSON.stringify(json)));
          });
        } else {
          setError(err);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  return { loading, error, data };
}

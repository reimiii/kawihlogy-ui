import { useCallback, useState } from "react";
import {
  ResponseError,
  type AuthLoginPostRequest,
  type AuthRegisterPost201Response,
} from "../api";
import { api } from "../api/config";

interface UseLoginResult {
  loading: boolean;
  error: Error | null | any;
  data: AuthRegisterPost201Response | null;
  login: (payload: AuthLoginPostRequest) => void;
}

export function useAuthLogin(): UseLoginResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | any | null>(null);
  const [data, setData] = useState<AuthRegisterPost201Response | null>(null);

  const login = useCallback(({ email, password }: AuthLoginPostRequest) => {
    setLoading(true);
    setError(null);
    setData(null);

    api
      .authLoginPost({ authLoginPostRequest: { email, password } })
      .then(setData)
      .catch((err) => {
        if (err instanceof ResponseError) {
          err.response.json().then((json) => {
            setError(new Error(JSON.stringify(json)));
          });
        } else {
          setError(err);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return { loading, error, data, login };
}

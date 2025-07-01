import { useState } from "react";
import {
  ResponseError,
  type AuthRegisterPost201Response,
  type AuthRegisterPostRequest,
} from "../api";
import { api } from "../api/config";

interface UseRegisterResult {
  loading: boolean;
  error: Error | null | any;
  data: AuthRegisterPost201Response | null;
  register: (payload: AuthRegisterPostRequest) => void;
}

export function useAuthRegister(): UseRegisterResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | any | null>(null);
  const [data, setData] = useState<AuthRegisterPost201Response | null>(null);

  const register = async ({
    email,
    name,
    password,
  }: AuthRegisterPostRequest) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await api.authRegisterPost({
        authRegisterPostRequest: { email, name, password },
      });
      setData(res);
    } catch (err: unknown) {
      if (err instanceof ResponseError) {
        const body = await err.response.json();
        setError(body);
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, data, register };
}

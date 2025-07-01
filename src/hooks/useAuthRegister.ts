import { useState } from "react";
import type {
  AuthRegisterPost201Response,
  AuthRegisterPostRequest,
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

  const register = ({ email, name, password }: AuthRegisterPostRequest) => {
    setLoading(true);
    setError(null);
    setData(null);

    api
      .authRegisterPost({
        authRegisterPostRequest: {
          email,
          name,
          password,
        },
      })
      .then((res) => {
        setData(res);
      })
      .catch((err: any) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { loading, error, data, register };
}

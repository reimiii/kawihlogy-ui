import axios from "axios";
import { Env } from "../env";
import { ApiError } from "./api.types";

export const api = axios.create({
  baseURL: Env.api.baseUrl,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const res = err?.response;
    if (res?.data && typeof res.data === "object") {
      throw new ApiError(res.data);
    }
    throw err;
  },
);

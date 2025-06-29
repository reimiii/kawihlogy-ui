import { DefaultApi } from "./apis";
import { Configuration } from "./runtime";

export const conf = new Configuration({
  basePath: "http://localhost:3000",
  accessToken: () => localStorage.getItem("accessToken") || "",
});

export const api = new DefaultApi(conf);

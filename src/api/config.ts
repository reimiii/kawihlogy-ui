import { Env } from "../env";
import { DefaultApi } from "./apis";
import { Configuration } from "./runtime";

const conf = new Configuration({
  basePath: Env.api.baseUrl,
});

export const api = new DefaultApi(conf);

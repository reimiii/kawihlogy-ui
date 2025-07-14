import axios from "axios";
import { Env } from "../env";
import { DefaultApi } from "./apis";
import { Configuration, ResponseError } from "./runtime";

const conf = new Configuration({
  basePath: Env.api.baseUrl,
  accessToken: () => localStorage.getItem("accessToken") ?? "",
});

export const api = new DefaultApi(conf);

const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxZGFiZTkzLWMzYTItNDRjOS04MDYyLWNkNjIzMDU5YzM1YiIsImVtYWlsIjoibWVAbWUuY28iLCJyb2xlIjoiZWNobyIsImlhdCI6MTc1MjQ3MjQzOSwiZXhwIjoxNzUyNTU4ODM5fQ.fIa_GKoWXm9J0GC8fL5nIEdEnRuZnLn1Yrk_fstXOTw`;
const postJournal = async () => {
  try {
    const res = await axios.post(
      `${Env.api.baseUrl}/journal`, // Ganti dengan endpoint yang benar
      {
        title: "zzzzzzzc",
        content: "zzzzzzzz",
        emotions: ["zzz"],
        topics: ["zzz"],
        date: new Date(),
        isPrivate: false,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    console.log("response", res.data);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      console.error("error", err.response.data);
    } else {
      console.error("unexpected error", err);
    }
  }
};

postJournal();

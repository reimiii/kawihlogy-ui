import { io, Socket } from "socket.io-client";
import { Env } from "../env";

export const socket: Socket = io(`${Env.socket.baseUrl}/poem`, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
});

import { createContext } from "react";
import type { Socket } from "socket.io-client";

export type SocketContextValue = {
  isConnected: boolean;
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

export default SocketContext;

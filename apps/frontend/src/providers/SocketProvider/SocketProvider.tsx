import { useEffect, useMemo, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "../../constants";
import SocketContext from "./SocketContext";

interface SocketProviderProps {
  children: React.ReactNode;
}

const socketUrl = import.meta.env.VITE_SOCKET_URL;

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const socket = useMemo<Socket>(
    () =>
      io(socketUrl, {
        path: "/socket.io",
        transports: ["websocket"],
        autoConnect: false,
      }),
    [],
  );

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socket.on(SOCKET_EVENTS.CONNECT, handleConnect);
    socket.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
    socket.connect();

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, handleConnect);
      socket.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

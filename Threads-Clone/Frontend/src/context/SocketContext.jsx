import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const currentUser = useRecoilValue(userAtom);

  useEffect(() => {
    const socket = io("/", {
      query: {
        userId: currentUser?._id,
      },
    });

    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });
    setSocket(socket);

    return () => socket && socket.close();
  }, [currentUser?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

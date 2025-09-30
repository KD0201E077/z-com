import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null;
//커스텀훅간에 공유할 데이터는 따로 뺀다
//이렇게 안빼면 WebSockComponnent랑 MessageForm에서 두번 불러질때 각각 따로 생성됨
export default function useSocket(): [Socket | null, () => void] {
  const { data: session } = useSession();
  const disconnect = useCallback(() => {
    socket?.disconnect();
    socket = null;
  }, []);

  useEffect(() => {
    if (!socket) {
      socket = io(`${process.env.NEXT_PUBLIC_BASE_URL}/messages`, {
        transports: ["websocket"],
      });
      socket.on("connect_error", (err) => {
        console.error(err);
        console.log(`connect_error due to ${err.message}`);
      });
    }
  }, []);

  useEffect(() => {
    if (socket?.connected && session?.user?.email) {
      socket?.emit("login", { id: session?.user?.email });
    }
  }, [session]);

  return [socket, disconnect];
}

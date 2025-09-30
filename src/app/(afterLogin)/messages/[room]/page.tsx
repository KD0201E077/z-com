import { auth } from "@/auth";
import { QueryClient } from "@tanstack/react-query";
import "dayjs/locale/ko";
import { getUserServer } from "../../[username]/_lib/getUserServer";
import MessageForm from "./_component/MessageForm";
import MessageList from "./_component/MessageList";
import UserInfo from "./_component/UserInfo";
import WebSocketComponent from "./_component/WebSocketComponent";
import style from "./chatRoom.module.css";

type Props = {
  params: Promise<{ room: string }>;
};

export default async function ChatRoom({ params }: Props) {
  const { room } = await params;
  const session = await auth();
  const queryClient = new QueryClient();
  const ids = room.split("-").filter((v) => v !== session?.user?.email);

  if (!ids[0]) {
    return null;
  }
  await queryClient.prefetchQuery({
    queryKey: ["users", ids[0]],
    queryFn: getUserServer,
  });

  return (
    <main className={style.main}>
      <WebSocketComponent />
      <UserInfo id={ids[0]} />
      <MessageList id={ids[0]} />
      <MessageForm id={ids[0]} />
    </main>
  );
}

import { auth } from "@/auth";
import { Metadata } from "next";
import Room from "./_component/Room";
import { getRooms } from "./_lib/getRooms";
import style from "./message.module.css";

export const metadata: Metadata = {
  title: "쪽지 / Z",
  description: "쪽지를 보내보세요.",
};

export default async function Home() {
  const session = await auth();
  const rooms = session?.user?.email
    ? await getRooms(session?.user?.email)
    : [];
  return (
    <main className={style.main}>
      <div className={style.header}>
        <h3>쪽지</h3>
      </div>
      <div className={style.list}>
        {rooms.map((room) => (
          <Room key={room.room} room={room} />
        ))}
      </div>
    </main>
  );
}

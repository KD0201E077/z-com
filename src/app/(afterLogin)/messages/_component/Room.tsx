"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import style from "../message.module.css";

dayjs.locale("ko");
dayjs.extend(relativeTime);

export default function Room() {
  const user = {
    id: "hero",
    nickname: "영웅",
    Messages: [
      { roomId: 123, content: "안녕하세요", createdAt: new Date() },
      { roomId: 123, content: "안녕하세요2", createdAt: new Date() },
    ],
  };

  const imgUrl = `https://picsum.photos/640/480?random=${Math.floor(
    Math.random() * 1000
  )}`;

  const router = useRouter();

  const onClick = () => {
    router.push(`/messages/${user.Messages.at(-1)?.roomId}`);
  };

  return (
    <div className={style.room} onClick={onClick}>
      <div className={style.roomUserImage}>
        <img src={imgUrl} alt="" />
      </div>
      <div className={style.roomChatInfo}>
        <div className={style.roomUserInfo}>
          <b>{user.nickname}</b>
          &nbsp;
          <span>@{user.id}</span>
          &nbsp; · &nbsp;
          <span className={style.postDate}>
            {dayjs(user.Messages?.at(-1)?.createdAt).fromNow(true)}
          </span>
        </div>
        <div className={style.roomLastChat}>
          {user.Messages?.at(-1)?.content}
        </div>
      </div>
    </div>
  );
}

"use client";

import { Message } from "@/model/Message";
import { useMessageStore } from "@/store/message";
import {
  DefaultError,
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getMessages } from "../_lib/getMessages";
import useSocket from "../_lib/useSocket";
import style from "../chatRoom.module.css";

dayjs.locale("ko");
dayjs.extend(relativeTime);

interface Props {
  id: string;
}

export default function MessageList({ id }: Props) {
  const { data: session } = useSession();
  const [pageRendered, setPageRendered] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const shouldGoDown = useMessageStore().shouldGoDown;
  const setGoDown = useMessageStore().setGoDown;
  const [adjustingScroll, setAdjustingScroll] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: messages,
    isFetching,
    hasPreviousPage,
    fetchPreviousPage,
  } = useInfiniteQuery<
    Message[],
    DefaultError,
    InfiniteData<Message[]>,
    [string, { senderId: string; receiverId: string }, string],
    number
  >({
    queryKey: [
      "rooms",
      {
        senderId: session?.user?.email as string,
        receiverId: id,
      },
      "messages",
    ],
    queryFn: getMessages,
    initialPageParam: 0,
    //리버스 인피니트 스크롤링
    getPreviousPageParam: (firstPage) =>
      firstPage.length < 10 ? undefined : firstPage.at(0)?.messageId,
    getNextPageParam: (lastPage) =>
      lastPage.length < 10 ? undefined : lastPage.at(-1)?.messageId,
    enabled: !!(session?.user?.email && id),
  });

  const { ref, inView } = useInView({
    threshold: 0,
    delay: 0,
  });

  useEffect(() => {
    if (inView) {
      if (!isFetching && hasPreviousPage && !adjustingScroll) {
        const prevHeight = listRef.current?.scrollHeight || 0;
        fetchPreviousPage().then(() => {
          setAdjustingScroll(true);
          setTimeout(() => {
            if (listRef.current) {
              listRef.current.scrollTop =
                listRef.current.scrollHeight - prevHeight;
            }
            setAdjustingScroll(false);
          }, 0);
        });
      }
    }
  }, [inView, isFetching, hasPreviousPage, fetchPreviousPage]);

  const hasMessages = !!messages;
  useEffect(() => {
    if (hasMessages) {
      console.log(listRef.current);
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current?.scrollHeight;
      }
      setPageRendered(true);
    }
  }, [hasMessages]);

  useEffect(() => {
    if (shouldGoDown) {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current?.scrollHeight;
        setGoDown(false);
      }
    }
  }, [shouldGoDown, setGoDown]);

  const [socket] = useSocket();
  useEffect(() => {
    socket?.on("receiveMessage", (data) => {
      console.log("data", data);
      // 리액트 쿼리 데이터에 추가
      const exMessages = queryClient.getQueryData([
        "rooms",
        {
          senderId: session?.user?.email,
          receiverId: id,
        },
        "messages",
      ]) as InfiniteData<Message[]>;

      if (exMessages && typeof exMessages === "object") {
        const newMessages = {
          ...exMessages,
          pages: [...exMessages.pages],
        };
        const lastPage = newMessages.pages.at(-1);
        const newLastPage = lastPage ? [...lastPage] : [];
        newLastPage.push(data);
        newMessages.pages[newMessages.pages.length - 1] = newLastPage;
        queryClient.setQueryData(
          [
            "rooms",
            { senderId: session?.user?.email, receiverId: id },
            "messages",
          ],
          newMessages
        );
        setGoDown(true);
      }
    });
    return () => {
      socket?.off("receiveMessage");
    };
  }, [socket]);

  //unmount될때 캐시 초기화
  useEffect(() => {
    return () => {
      queryClient.resetQueries({
        queryKey: [
          "rooms",
          {
            senderId: session?.user?.email as string,
            receiverId: id,
          },
          "messages",
        ],
      });
    };
  }, [id, session?.user?.email]);

  return (
    <div className={style.list} ref={listRef}>
      {!adjustingScroll && pageRendered && (
        <div ref={ref} style={{ height: 10 }} />
      )}
      {messages?.pages?.map((page) =>
        page.map((m) => {
          if (m.senderId === session?.user?.email) {
            // 내 메시지면
            return (
              <div
                key={m.messageId}
                className={clsx(style.message, style.myMessage)}
              >
                <div className={style.content}>{m.content}</div>
                <div className={style.date}>
                  {dayjs(m.createdAt).format("YYYY년 MM월 DD일 A HH시 mm분")}
                </div>
              </div>
            );
          }
          return (
            <div
              key={m.messageId}
              className={clsx(style.message, style.yourMessage)}
            >
              <div className={style.content}>{m.content}</div>
              <div className={style.date}>
                {dayjs(m.createdAt).format("YYYY년 MM월 DD일 A HH시 mm분")}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

"use client";

import { Message } from "@/model/Message";
import { useMessageStore } from "@/store/message";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { ChangeEventHandler, FormEventHandler, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import useSocket from "../_lib/useSocket";
import style from "./MessageForm.module.css";

interface Props {
  id: string;
}

export default function MessageForm({ id }: Props) {
  const [content, setContent] = useState("");
  const setGoDown = useMessageStore().setGoDown;
  const [preview, setPreview] = useState<
    Array<{ dataUrl: string; file: File } | null>
  >([]);
  const [socket] = useSocket();
  const { data: session } = useSession();
  const imageRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const onChangeContent: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setContent(e.target.value);
  };
  const onClickButton = () => {
    imageRef.current?.click();
  };
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    if (!session?.user?.email) {
      return;
    }
    e.preventDefault();
    const ids = [session?.user?.email, id];
    ids.sort();
    // socket.io
    //메시지는 서버랑 정하는 것
    socket?.emit("sendMessage", {
      senderId: session?.user?.email,
      receiverId: id,
      content,
    });
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
      const lastMessageId = lastPage?.at(-1)?.messageId;
      newLastPage.push({
        senderId: session?.user?.email,
        receiverId: id,
        content,
        room: ids.join("-"),
        messageId: lastMessageId ? lastMessageId + 1 : 1,
        createdAt: new Date(),
      });
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
    setContent("");
  };

  const onRemoveImage = (index: number) => () => {
    setPreview((prev) => {
      const shallow = [...prev];
      shallow[index] = null;
      return shallow;
    });
  };

  const onUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    console.log(e.target.files);
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const tempPreviews: Array<{ dataUrl: string; file: File }> = [];
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          tempPreviews.push({
            dataUrl: reader.result as string,
            file,
          });
          //readAsDataURL는 비동기 작업임
          if (tempPreviews.length === newFiles.length) {
            setPreview((prev) => [...prev, ...tempPreviews]);
            console.log(preview);
          }
        };
        reader.readAsDataURL(file);
      });
    }
    if (imageRef.current) {
      //같은걸 연속으로 선택할 수 있게끔
      imageRef.current.value = "";
    }
  };

  return (
    <>
      {preview && (
        <div style={{ display: "flex" }}>
          {preview.map(
            (v, index) =>
              v && (
                <div
                  key={index}
                  style={{ flex: 1 }}
                  onClick={onRemoveImage(index)}
                >
                  <img
                    src={v.dataUrl}
                    style={{
                      width: "100%",
                      maxHeight: 100,
                      objectFit: "contain",
                    }}
                    alt="미리보기"
                  />
                </div>
              )
          )}
        </div>
      )}
      <div className={style.formZone}>
        <form className={style.form} onSubmit={onSubmit}>
          <input
            type="file"
            name="imageFiles"
            multiple
            hidden
            ref={imageRef}
            onChange={onUpload}
          />
          <button
            className={style.uploadButton}
            type="button"
            onClick={onClickButton}
          >
            <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
              <g>
                <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
              </g>
            </svg>
          </button>
          <TextareaAutosize value={content} onChange={onChangeContent} />
          <button
            className={style.submitButton}
            type="submit"
            disabled={!content?.trim()}
          >
            <svg
              viewBox="0 0 24 24"
              width={18}
              aria-hidden="true"
              className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
            >
              <g>
                <path d="M2.504 21.866l.526-2.108C3.04 19.719 4 15.823 4 12s-.96-7.719-.97-7.757l-.527-2.109L22.236 12 2.504 21.866zM5.981 13c-.072 1.962-.34 3.833-.583 5.183L17.764 12 5.398 5.818c.242 1.349.51 3.221.583 5.183H10v2H5.981z"></path>
              </g>
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}

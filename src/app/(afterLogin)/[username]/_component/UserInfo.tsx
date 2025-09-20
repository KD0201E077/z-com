"use client";

import { User } from "@/model/User";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import BackButton from "../../_component/BackButton";
import { getUser } from "../_lib/getUser";
import style from "../profile.module.css";
import ProfileFollowButton from "./ProfileFollowButton";

type Props = {
  username: string;
  session: Session | null;
};

export default function UserInfo({ username, session }: Props) {
  const { data: user, error } = useQuery<
    User,
    object,
    User,
    [_1: string, _2: string]
  >({
    queryKey: ["users", username],
    queryFn: getUser,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
  });

  console.log("user", user);
  if (error) {
    return (
      <>
        <div className={style.header}>
          <BackButton />
          <h3 className={style.headerTitle}>프로필</h3>
        </div>
        <div className={style.userZone}>
          <div className={style.userImage}></div>
          <div className={style.userName}>
            <div>@{username}</div>
          </div>
        </div>
        <div
          style={{
            height: 100,
            alignItems: "center",
            fontSize: 31,
            fontWeight: "bold",
            justifyContent: "center",
            display: "flex",
          }}
        >
          계정이 존재하지 않음
        </div>
      </>
    );
  }
  if (!user) {
    return null;
  }

  const followed = !!user.Followers?.find((v) => v.id === session?.user?.email);

  return (
    <>
      <div className={style.headerFixed}>
        <BackButton />
        <h3 className={style.headerTitle}>{user.nickname}</h3>
      </div>
      <div className={style.userZone}>
        <div className={style.userRow}>
          <div className={style.userImage}>
            <img src={user.image} alt={user.id} />
          </div>
          <div className={style.userName}>
            <div>{user.nickname}</div>
            <div>@{user.id}</div>
          </div>
          {user.id !== session?.user?.email && (
            <ProfileFollowButton userId={user.id} followed={followed} />
          )}
        </div>
        <div className={style.userFollower}>
          <div>{user._count.Followers} 팔로워</div>
          &nbsp;
          <div>{user._count.Followings} 팔로우 중</div>
        </div>
      </div>
    </>
  );
}

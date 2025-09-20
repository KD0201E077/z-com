"use client";

import { useContext } from "react";
import FollowingPosts from "./FollowingPosts";
import PostRecommends from "./PostRecommends";
import { TabContext } from "./TabProvider";

export default function TabDecider() {
  const { tab } = useContext(TabContext);
  if (tab === "rec") {
    return <PostRecommends />;
  }
  return <FollowingPosts />;
}

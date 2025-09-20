"use client";

import FollowRecommend from "@/app/(afterLogin)/_component/FollowRecommend";
import { getFollowRecommends } from "@/app/(afterLogin)/_lib/getFollowRecommends";
import { User } from "@/model/User";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function FollowRecommendSection() {
  const { data } = useQuery<User[]>({
    queryKey: ["users", "followRecommends"],
    queryFn: getFollowRecommends,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
  });
  useEffect(() => {
    console.log(data);
  }, [data]);

  return data?.map((user) => <FollowRecommend user={user} key={user.id} />);
}

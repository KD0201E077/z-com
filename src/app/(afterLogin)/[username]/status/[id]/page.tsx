import BackButton from "@/app/(afterLogin)/_component/BackButton";
import { Post } from "@/model/Post";
import { User } from "@/model/User";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";
import { getUserServer } from "../../_lib/getUserServer";
import CommentForm from "./_component/CommentForm";
import Comments from "./_component/Comments";
import SinglePost from "./_component/SinglePost";
import { getComments } from "./_lib/getComments";
import { getSinglePostServer } from "./_lib/getSinglePostServer";
import style from "./singlePost.module.css";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, id } = await params;
  const [user, post]: [User, Post] = await Promise.all([
    getUserServer({ queryKey: ["users", username] }),
    getSinglePostServer({ queryKey: ["posts", id] }),
  ]);
  return {
    title: `Z에서 ${user.nickname} 님 : ${post.content}`,
    description: post.content,
    openGraph: {
      title: `${user.nickname} (${user.id}) / Z`,
      description: `${user.nickname} (${user.id}) 프로필`,
      images:
        post.Images?.length > 0
          ? post.Images?.map((v) => ({
              url: `https://localhost:3000${v.link}`,
              width: 600,
              height: 400,
            }))
          : [
              {
                url: `https://localhost:3000${user.image}`,
                width: 400,
                height: 400,
              },
            ],
    },
  };
}

type Props = {
  params: Promise<{ id: string; username: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["posts", id],
    queryFn: getSinglePostServer,
  });
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", id, "comments"],
    queryFn: getComments,
    initialPageParam: 0,
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className={style.main}>
      <HydrationBoundary state={dehydratedState}>
        <div className={style.header}>
          <BackButton />
          <h3 className={style.headerTitle}>게시하기</h3>
        </div>
        <div className={style.postWrapper}>
          <SinglePost id={id} />
        </div>
        <CommentForm id={id} />
        <div>
          <Comments id={id} />
        </div>
      </HydrationBoundary>
    </div>
  );
}

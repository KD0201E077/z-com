import { PostImage } from "./PostImage";
import { User } from "./User";

interface UserID {
  userId: string;
}

export interface Post {
  postId: number;
  User: User;
  content: string;
  createdAt: Date;
  Images: PostImage[];
  Hearts: UserID[];
  Reposts: UserID[];
  Comments: UserID[];
  _count: {
    Hearts: number;
    Reposts: number;
    Comments: number;
  };
  Original?: Post;
  Parent?: Post;
}

import PostForm from "components/posts/PostForm";
import PostBox from "components/posts/PostBox";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any;
}

const post: PostProps[] = [];

export default function HomePage() {
  return (
    <div className="home">
      <div className="home__title">Home</div>
      <div className="home__tabs">
        <div className="home__tab home__tab--active">For you</div>
        <div className="home__tab home__tab--active">Following</div>
      </div>
      <PostForm />
      <div className="post">
        {post?.map((post) => (
          <PostBox key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

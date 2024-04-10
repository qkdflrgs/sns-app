import PostForm from "components/posts/PostForm";
import PostBox from "components/posts/PostBox";
import { useContext, useEffect, useState } from "react";
import AuthContext from "context/AuthContext";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "firebaseApp";

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
  hashTags: string[];
}

export default function HomePage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      let postQuery = query(postsRef, orderBy("createdAt", "desc"));

      onSnapshot(postQuery, (snapshot) => {
        const dataObj = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPosts(dataObj as PostProps[]);
      });
    }
  }, [user]);

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">Home</div>
        <div className="home__tabs">
          <div className="home__tab home__tab--active">For you</div>
          <div className="home__tab home__tab--active">Following</div>
        </div>
      </div>
      <PostForm />
      <div className="post">
        {posts.length > 0 ? (
          posts?.map((post) => <PostBox key={post.id} post={post} />)
        ) : (
          <div className="post__no-posts">
            <div className="post__text">게시글이 없습니다</div>
          </div>
        )}
      </div>
    </div>
  );
}

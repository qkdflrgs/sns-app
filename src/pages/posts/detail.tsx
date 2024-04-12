import Loader from "components/Loader/Loader";
import PostBox from "components/posts/PostBox";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostHeader from "components/posts/PostHeader";
import CommentForm from "components/comment/CommentForm";
import CommentBox, { CommentProps } from "components/comment/CommentBox";

export default function PostDetail() {
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);

      onSnapshot(docRef, (doc) => {
        setPost({ ...(doc?.data() as PostProps), id: doc.id });
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id, post?.likes]);

  return (
    <div className="post">
      <PostHeader />
      {post ? (
        <>
          <PostBox post={post} />
          <CommentForm post={post} />
          {post.comments &&
            post.comments
              .slice(0)
              .reverse()
              .map((data: CommentProps, index: number) => (
                <CommentBox key={index} data={data} post={post} />
              ))}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}

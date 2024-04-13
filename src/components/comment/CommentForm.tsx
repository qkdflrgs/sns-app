import AuthContext from "context/AuthContext";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { PostProps } from "pages/home";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

export interface CommentFormProps {
  post: PostProps | null;
}

export default function CommentForm({ post }: CommentFormProps) {
  const [comment, setComment] = useState<string>("");
  const { user } = useContext(AuthContext);
  const trans = useTranslation();

  const truncate = (string: string) => {
    return string.length > 10 ? string.substring(0, 10) + "..." : string;
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (post && user) {
      try {
        const postRef = doc(db, "posts", post.id);

        const commentObj = {
          comment: comment,
          uid: user.uid,
          email: user.email,
          createdAt: new Date().toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        };

        await updateDoc(postRef, {
          comments: arrayUnion(commentObj),
        });

        if (user.uid !== post.uid) {
          await addDoc(collection(db, "notifications"), {
            createdAt: new Date().toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            uid: post.uid,
            isRead: false,
            url: `/posts/${post.id}`,
            content: `${truncate(post.content)} 글에 댓글이 작성되었습니다`,
          });
        }

        toast.success("댓글을 생성했습니다");
        setComment("");
      } catch (e: any) {}
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        className="post-form__textarea"
        name="comment"
        id="comment"
        placeholder={trans("POST_PLACEHOLDER")}
        onChange={onChange}
        value={comment}
        required
      />
      <div className="post-form__submit-area">
        <div />
        <input
          className="post-form__submit-btn"
          type="submit"
          value={trans("BUTTON_COMMENT")}
          disabled={!comment}
        />
      </div>
    </form>
  );
}

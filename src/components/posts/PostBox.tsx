import FollowingBox from "components/following/FollowingBox";
import AuthContext from "context/AuthContext";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { PostProps } from "pages/home";
import { useContext } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface PostBoxProps {
  post: PostProps;
}

export default function PostBox({ post }: PostBoxProps) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const imageRef = ref(storage, post?.imageUrl);
  const trans = useTranslation();

  const handleDelete = async () => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");

    if (post.imageUrl) {
      deleteObject(imageRef).catch((error) => {
        console.log(error);
      });
    }

    if (confirm) {
      await deleteDoc(doc(db, "posts", post.id));
      toast.success("게시글을 삭제했습니다");
      navigate("/");
    }
  };

  const toggleLike = async () => {
    const postRef = doc(db, "posts", post.id);

    if (user?.uid && post.likes?.includes(user?.uid)) {
      await updateDoc(postRef, {
        likes: arrayRemove(user.uid),
        likeCount: post.likeCount ? post.likeCount - 1 : 0,
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(user?.uid),
        likeCount: post.likeCount ? post.likeCount + 1 : 1,
      });
    }
  };

  return (
    <div key={post.id} className="post__box">
      <div className="post__box-profile">
        <div className="post__flex">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="profile"
              className="post__box-profile-img"
            />
          ) : (
            <FaUserCircle className="post__box-profile-icon" />
          )}
          <div className="post__flex--between">
            <div className="post__flex">
              <div className="post__email">{post.email}</div>
              <div className="post__createdAt">{post.createdAt}</div>
            </div>
            <FollowingBox post={post} />
          </div>
        </div>
        <Link to={`/posts/${post.id}`}>
          <div className="post__box-content">{post.content}</div>
          {post.imageUrl && (
            <div className="post__image-div">
              <img
                src={post.imageUrl}
                alt="post img"
                className="post__image"
                width={100}
                height={100}
              />
            </div>
          )}
          <div className="post-form__hashtags-output">
            {post.hashTags?.map((hashtag, index) => (
              <span className="post-form__hashtags-tag" key={index}>
                #{hashtag}
              </span>
            ))}
          </div>
        </Link>
      </div>
      <div className="post__box-footer">
        {user?.uid === post.uid && (
          <>
            <button
              type="button"
              className="post__delete"
              onClick={handleDelete}
            >
              {trans("BUTTON_DELETE")}
            </button>
            <button type="button" className="post__edit">
              <Link to={`/posts/edit/${post.id}`}>{trans("BUTTON_EDIT")}</Link>
            </button>
          </>
        )}
        <button type="button" className="post__likes" onClick={toggleLike}>
          {user && post.likes?.includes(user.uid) ? (
            <AiFillHeart />
          ) : (
            <AiOutlineHeart />
          )}
          {post.likeCount || 0}
        </button>
        <button type="button" className="post__comments">
          <FaRegComment />
          {post.comments?.length || 0}
        </button>
      </div>
    </div>
  );
}

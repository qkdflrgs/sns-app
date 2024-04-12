import AuthContext from "context/AuthContext";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface FollowingProps {
  post: PostProps;
}

export interface UserProps {
  id: string;
}

export default function FollowingBox({ post }: FollowingProps) {
  const { user } = useContext(AuthContext);
  const [postFollowers, setPostFollowers] = useState<any>([]);

  const onClickFollow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      if (user?.uid) {
        // 내가 주체가 되어 '팔로잉' 컬렉션 생성 또는 업데이트
        const followingRef = doc(db, "following", post.uid);
        setDoc(
          followingRef,
          {
            users: arrayUnion({ id: post.uid }),
          },
          { merge: true }
        );
        // 팔로우 상대가 주체가 되어 '팔로우' 컬렉션 생성 또는 업데이트
        const followerRef = doc(db, "follower", post.uid);
        setDoc(
          followerRef,
          {
            users: arrayUnion({ id: user.uid }),
          },
          { merge: true }
        );
      }
      toast.success("팔로우를 했습니다");
    } catch (e: any) {
      console.log(e.code);
    }
  };

  const onClickDeleteFollow = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      if (user?.uid) {
        const followingRef = doc(db, "following", post.uid);
        await updateDoc(followingRef, {
          users: arrayRemove({ id: post.uid }),
        });

        const followerRef = doc(db, "follower", post.uid);
        await updateDoc(followerRef, {
          users: arrayRemove({ id: user.uid }),
        });
      }
      toast.success("팔로우를 취소했습니다");
    } catch (e: any) {
      console.log(e);
    }
  };

  const getFollowers = useCallback(async () => {
    if (post.uid) {
      const ref = doc(db, "follower", post.uid);

      onSnapshot(ref, (doc) => {
        setPostFollowers([]);
        doc
          .data()
          ?.users.map((user: UserProps) =>
            setPostFollowers((prev: UserProps[]) =>
              prev ? [...prev, user.id] : []
            )
          );
      });
    }
  }, [post.uid]);

  useEffect(() => {
    if (post.uid) getFollowers();
  }, [getFollowers, post.uid]);

  return (
    <>
      {user?.uid !== post.uid && postFollowers.includes(user?.uid) ? (
        <button
          type="button"
          className="post__following-btn"
          onClick={onClickDeleteFollow}
        >
          Following
        </button>
      ) : (
        <button
          type="button"
          className="post__follow-btn"
          onClick={onClickFollow}
        >
          Follow
        </button>
      )}
    </>
  );
}

import PostForm from "components/posts/PostForm";
import PostBox from "components/posts/PostBox";
import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "context/AuthContext";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { UserProps } from "components/following/FollowingBox";
import useTranslation from "hooks/useTranslation";

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
  imageUrl?: string;
}

type TabType = "all" | "following";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [followingPosts, setFollowingPosts] = useState<PostProps[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([""]);
  const { user } = useContext(AuthContext);
  const trans = useTranslation();

  const getFollowingIds = useCallback(async () => {
    if (user?.uid) {
      const ref = doc(db, "following", user.uid);
      onSnapshot(ref, (doc) => {
        setFollowingIds([""]);
        doc
          .data()
          ?.user.map((user: UserProps) =>
            setFollowingIds((prev) => (prev ? [...prev, user.id] : []))
          );
      });
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      let postQuery = query(postsRef, orderBy("createdAt", "desc"));
      let followingQuery = query(
        postsRef,
        where("uid", "in", followingIds),
        orderBy("createdAt", "desc")
      );

      onSnapshot(postQuery, (snapshot) => {
        const dataObj = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPosts(dataObj as PostProps[]);
      });

      onSnapshot(followingQuery, (snapshot) => {
        const dataObj = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setFollowingPosts(dataObj as PostProps[]);
      });
    }
  }, [user, followingIds]);

  useEffect(() => {
    if (user?.uid) getFollowingIds();
  }, [user?.uid, getFollowingIds]);

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">{trans("MENU_HOME")}</div>
        <div className="home__tabs">
          <div
            className={`home__tab ${
              activeTab === "all" && "home__tab--active"
            }`}
            onClick={() => setActiveTab("all")}
          >
            {trans("TAB_ALL")}
          </div>
          <div
            className={`home__tab ${
              activeTab === "following" && "home__tab--active"
            }`}
            onClick={() => setActiveTab("following")}
          >
            {trans("TAB_FOLLOWING")}
          </div>
        </div>
      </div>
      <PostForm />
      {activeTab === "all" && (
        <div className="post">
          {posts.length > 0 ? (
            posts?.map((post) => <PostBox key={post.id} post={post} />)
          ) : (
            <div className="post__no-posts">
              <div className="post__text">{trans("NO_POST")}</div>
            </div>
          )}
        </div>
      )}
      {activeTab === "following" && (
        <div className="post">
          {followingPosts.length > 0 ? (
            followingPosts?.map((post) => <PostBox key={post.id} post={post} />)
          ) : (
            <div className="post__no-posts">
              <div className="post__text">{trans("NO_POST")}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

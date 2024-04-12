import PostBox from "components/posts/PostBox";
import AuthContext from "context/AuthContext";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PROFILE_DEFAULT_URL = "/logo512";
type TabType = "my" | "like";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("my");
  const [myPosts, setMyPosts] = useState<PostProps[]>([]);
  const [likePosts, setLikePosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      const myPostQuery = query(
        postsRef,
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const likePostQuery = query(
        postsRef,
        where("likes", "array-contains", user.uid),
        orderBy("createdAt", "desc")
      );

      onSnapshot(myPostQuery, (snapshot) => {
        const dataObj = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMyPosts(dataObj as PostProps[]);
      });

      onSnapshot(likePostQuery, (snapshot) => {
        const dataObj = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setLikePosts(dataObj as PostProps[]);
      });
    }
  }, [user, myPosts, likePosts]);

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">Profile</div>
        <div className="profile">
          <img
            src={user?.photoURL || PROFILE_DEFAULT_URL}
            alt="profile"
            className="profile__image"
            width={100}
            height={100}
          />
          <button
            type="button"
            className="profile__btn"
            onClick={() => navigate("/profile/edit")}
          >
            프로필 수정
          </button>
        </div>
        <div className="profile__text">
          <div className="profile__name">{user?.displayName || "사용자님"}</div>
          <div className="profile__email">{user?.email}</div>
        </div>
        <div className="home__tabs">
          <div
            className={`home__tab ${activeTab === "my" && "home__tab--active"}`}
            onClick={() => setActiveTab("my")}
          >
            For you
          </div>
          <div
            className={`home__tab ${
              activeTab === "like" && "home__tab--active"
            }`}
            onClick={() => setActiveTab("like")}
          >
            Likes
          </div>
        </div>
        {activeTab === "my" ? (
          <div className="post">
            {myPosts.length > 0 ? (
              myPosts.map((post) => <PostBox key={post.id} post={post} />)
            ) : (
              <div className="post__no-posts">
                <div className="post__text">게시글이 없습니다</div>
              </div>
            )}
          </div>
        ) : (
          <div className="post">
            {likePosts.length > 0 ? (
              likePosts.map((post) => <PostBox key={post.id} post={post} />)
            ) : (
              <div className="post__no-posts">
                <div className="post__text">게시글이 없습니다</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

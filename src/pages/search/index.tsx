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
import useTranslation from "hooks/useTranslation";
import { PostProps } from "pages/home";
import { useContext, useEffect, useState } from "react";

export default function SearchPage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [hashtagQuery, setHashtagQuery] = useState<string>("");
  const { user } = useContext(AuthContext);
  const trans = useTranslation();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHashtagQuery(e.target.value.trim());
  };

  useEffect(() => {
    if (user) {
      let postRef = collection(db, "posts");
      let postQuery = query(
        postRef,
        where("hashTags", "array-contains-any", [hashtagQuery]),
        orderBy("createdAt", "desc")
      );

      onSnapshot(postQuery, (snapshot) => {
        let dataObj = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setPosts(dataObj as PostProps[]);
      });
    }
  }, [user, hashtagQuery]);

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">
          <div className="home__title-text">{trans("MENU_SEARCH")}</div>
        </div>
        <div className="home__search-div">
          <input
            className="home__search"
            placeholder={trans("SEARCH_HASHTAGS")}
            onChange={onChange}
            value={hashtagQuery}
          />
        </div>
      </div>
      <div className="post">
        {posts.length > 0 ? (
          posts.map((post) => <PostBox key={post.id} post={post} />)
        ) : (
          <div className="post__no-posts">
            <div className="post__text">{trans("NO_POST")}</div>
          </div>
        )}
      </div>
    </div>
  );
}

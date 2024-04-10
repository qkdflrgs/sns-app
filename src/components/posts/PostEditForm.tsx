import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function PostEditForm() {
  const params = useParams();
  const [hashtag, setHashtag] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [post, setPost] = useState<PostProps | null>(null);
  const [content, setContent] = useState<string>("");
  const navigate = useNavigate();
  const handleFileUpload = () => {};

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap.data() as PostProps), id: docSnap.id });
      setContent(docSnap?.data()?.content);
      setHashtags(docSnap?.data()?.hashTags);
    }
  }, [params.id]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (post) {
        const postRef = doc(db, "posts", post.id);
        await updateDoc(postRef, {
          content: content,
          hashTags: hashtags,
        });
        navigate(`post/${post.id}`);
        toast.success("게시글을 수정했습니다");
      }
      setContent("");
    } catch (error: any) {
      toast.error(error?.code);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "content") {
      setContent(value);
    }
  };

  const onChangeHashtag = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHashtag(e.target.value.trim());
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.keyCode === 32 &&
      (e.target as HTMLInputElement).value.trim() !== ""
    ) {
      if (hashtags.includes((e.target as HTMLInputElement).value.trim())) {
        toast.error("이미 존재하는 태그입니다");
      } else {
        setHashtags((prev) =>
          prev.length > 0 ? [...prev, hashtag] : [hashtag]
        );
        setHashtag("");
      }
    }
  };

  const removeTag = (tag: string) => {
    setHashtags(hashtags.filter((value) => value !== tag));
  };

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        className="post-form__textarea"
        name="content"
        id="content"
        placeholder="What is happening?"
        onChange={onChange}
        value={content}
        required
      />
      <div className="post-form__hashtags">
        <span className="post-form__hashtags-outputs">
          {hashtags?.map((hashtag, index) => (
            <span
              className="post-form__hashtags-tag"
              key={index}
              onClick={() => {
                removeTag(hashtag);
              }}
            >
              #{hashtag}
            </span>
          ))}
        </span>
        <input
          className="post-form__input"
          name="hashtag"
          id="hashtag"
          placeholder="해시태그 + 스페이스바 입력"
          onChange={onChangeHashtag}
          onKeyUp={handleKeyUp}
          value={hashtag}
        />
      </div>
      <div className="post-form__submit-area">
        <label htmlFor="file-input" className="post-form__file">
          <FiImage className="post-form__file-icon" />
        </label>
        <input
          type="file"
          name="file-input"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <input type="submit" value="수정" className="post-form__submit-btn" />
      </div>
    </form>
  );
}

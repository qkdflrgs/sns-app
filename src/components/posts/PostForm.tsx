import AuthContext from "context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "firebaseApp";
import { FormEvent, useContext, useState } from "react";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function PostForm() {
  const [content, setContent] = useState<string>("");
  const [hashtag, setHashtag] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user } = useContext(AuthContext);

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = (e: any) => {
      const { result } = e.currentTarget;
      setImageFile(result);
    };
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);

    e.preventDefault();

    try {
      let imageUrl = "";
      if (imageFile) {
        const data = await uploadString(storageRef, imageFile, "data_url");
        imageUrl = await getDownloadURL(data.ref);
      }

      await addDoc(collection(db, "posts"), {
        content: content,
        createdAt: new Date().toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        uid: user?.uid,
        email: user?.email,
        hashTags: hashtags,
        imageUrl: imageUrl,
      });
      setContent("");
      setHashtag("");
      setHashtags([]);
      toast.success("게시글을 생성했습니다");
      setImageFile(null);
      setIsSubmitting(false);
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

  const handleDeleteImage = () => {
    setImageFile(null);
  };

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
        <div className="post-form__image-area">
          <label htmlFor="file-input" className="post-form__file">
            <FiImage className="post-form__file-icon" />
          </label>
          <input
            type="file"
            name="file-input"
            id="file-input"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          {imageFile && (
            <div className="post-form__attachment">
              <img src={imageFile} alt="attachment" width={100} height={100} />
              <button
                className="post-form__clear-btn"
                type="button"
                onClick={handleDeleteImage}
              >
                Clear
              </button>
            </div>
          )}
        </div>
        <input
          type="submit"
          value="Tweet"
          className="post-form__submit-btn"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
}

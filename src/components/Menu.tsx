import { BsHouse } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { MdLogin, MdLogout } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";
import useTranslation from "hooks/useTranslation";

export default function Menu() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const trans = useTranslation();

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      toast.success("로그아웃 되었습니다");
    } catch (error: any) {
      toast.error(error?.code);
    }
  };

  return (
    <div className="footer">
      <div className="footer__grid">
        <button type="button" onClick={() => navigate("/")}>
          <BsHouse />
          <span className="footer__grid--text">{trans("MENU_HOME")}</span>
        </button>
        <button type="button" onClick={() => navigate("/profile")}>
          <BiUserCircle />
          <span className="footer__grid--text">{trans("MENU_PROFILE")}</span>
        </button>
        <button type="button" onClick={() => navigate("/search")}>
          <AiOutlineSearch />
          <span className="footer__grid--text">{trans("MENU_SEARCH")}</span>
        </button>
        <button type="button" onClick={() => navigate("/notification")}>
          <IoMdNotificationsOutline />
          <span className="footer__grid--text">
            {trans("MENU_NOTIFICATIONS")}
          </span>
        </button>
        {user === null ? (
          <button type="button" onClick={() => navigate("/user/login")}>
            <MdLogin />
            <span className="footer__grid--text">{trans("MENU_LOGIN")}</span>
          </button>
        ) : (
          <button type="button" onClick={handleLogout}>
            <MdLogout />
            <span className="footer__grid--text">{trans("MENU_LOGOUT")}</span>
          </button>
        )}
      </div>
    </div>
  );
}

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
          {trans("MENU_HOME")}
        </button>
        <button type="button" onClick={() => navigate("/profile")}>
          <BiUserCircle />
          {trans("MENU_PROFILE")}
        </button>
        <button type="button" onClick={() => navigate("/search")}>
          <AiOutlineSearch />
          {trans("MENU_SEARCH")}
        </button>
        <button type="button" onClick={() => navigate("/notification")}>
          <IoMdNotificationsOutline />
          {trans("MENU_NOTIFICATIONS")}
        </button>
        {user === null ? (
          <button type="button" onClick={() => navigate("/user/login")}>
            <MdLogin />
            {trans("MENU_LOGIN")}
          </button>
        ) : (
          <button type="button" onClick={handleLogout}>
            <MdLogout />
            {trans("MENU_LOGOUT")}
          </button>
        )}
      </div>
    </div>
  );
}

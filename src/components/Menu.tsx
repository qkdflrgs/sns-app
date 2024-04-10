import { BsHouse } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { MdLogin, MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";

export default function Menu() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
          Home
        </button>
        <button type="button" onClick={() => navigate("/profile")}>
          <BiUserCircle />
          Profile
        </button>
        <button type="button" onClick={() => navigate("/search")}>
          <AiOutlineSearch />
          Search
        </button>
        {user === null ? (
          <button type="button" onClick={() => navigate("/user/login")}>
            <MdLogin />
            Login
          </button>
        ) : (
          <button type="button" onClick={handleLogout}>
            <MdLogout />
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

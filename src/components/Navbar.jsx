import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Navbar.css";

function Navbar() {
  const [user] = useAuthState(auth);

  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="sumsar-logo">
            Sumsar Icon sumsar
        </div>
        <div className="navigate">
          <Link to={"/"} className="Link">
            Home
          </Link>
          {user != null ? (
            <div className="user">
              <p>{user?.displayName}</p>
              <img src={user.photoURL && user.photoURL} alt="" />
              <button onClick={() => signOut(auth)}>Log Out</button>
            </div>
          ) : (
            <Link to={"/login"} className="Link">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;

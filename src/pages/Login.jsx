import { auth, provider } from "../config/firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const singedUser = await signInWithPopup(auth, provider);
    navigate("/Sumsar");
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => (user ? navigate("/Sumsar") : false));
  }, []);

  return (
    <div>
      <Navbar />
      <button onClick={signInWithGoogle}>
        <FcGoogle /> Access Sumsar with Google
      </button>
    </div>
  );
}

export default Login;

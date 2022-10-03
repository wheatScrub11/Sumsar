import React from "react";
import { useNavigate } from "react-router-dom";
function Error() {
  const navigate = useNavigate();
  navigate("/Sumsar")
  return <div onClick={navigate("/")}>This url doesnt exist</div>;
}

export default Error;

import { Route, Routes, Link } from "react-router-dom";

// Pages
import Main from "./pages/home/Home";
import Error from "./Pages/Error"
import Login from "./Pages/Login";

function App() {
  return <div className="App">
    <Routes>
      <Route path="/Sumsar" element={<Main />}/>
      <Route path="/Sumsar/login" element={<Login />}/>
      <Route path="*" element={<Error />}/>
    </Routes>
  </div>;
}

export default App;

import { Route, Routes, Link } from "react-router-dom";

// Pages
import Main from "./pages/home/Home";
import Error from "./Pages/Error"
import Login from "./Pages/Login";

function App() {
  return <div className="App">
    <Routes>
      <Route path="/" element={<Main />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="*" element={<Error />}/>
    </Routes>
  </div>;
}

export default App;

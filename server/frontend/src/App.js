import RegisterPanel from './components/Register/Register';
import LoginPanel from "./components/Login/Login";
import Dealers from './components/Dealers/Dealers';  // ← 追加
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<RegisterPanel />} />
      <Route path="/dealers" element={<Dealers />} />  {/* ← 追加 */}
    </Routes>
  );
}

export default App;

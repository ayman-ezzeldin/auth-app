import { Route, Routes } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import VerifyMailPage from "./components/VerifyMail";
import { useSelector } from "react-redux";

export default function App() {
  const {user} = useSelector((state) => state.auth);
  
  return (
    <>
      <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/verify" element={<VerifyMailPage />} />
          <Route path="/" element={<h1> Hello { user?.full_name || "ayman"} Here, you are logged in</h1>} />
        </Routes>
    </>
  )
}
import { Route, Routes } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import VerifyEamil from "./components/VerifyEamil";
import ProtectedPage from "./components/ProtectedPage";

export default function App() {
  return (
    <>
      <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/verify-email" element={<VerifyEamil />} />
          <Route path="/protected" element={<ProtectedPage />} />
          <Route path="/" element={<RegisterForm />} /> {/* Default to register */}
        </Routes>
    </>
  )
}
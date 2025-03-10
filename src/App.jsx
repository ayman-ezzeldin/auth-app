import { Route, Routes } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";

export default function App() {
  return (
    <>
      <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element={<RegisterForm />} /> {/* Default to register */}
        </Routes>
    </>
  )
}
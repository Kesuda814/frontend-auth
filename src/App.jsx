import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import LoginPage from "./Login";
import UserManagement from "./UserManagement"; // We will create this file

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
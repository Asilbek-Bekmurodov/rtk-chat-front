import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/register";
import Public from "./pages/public/Public";
import Dashboard from "./pages/Dashboard/Dashboard";

import Home from "./pages/home/Home";
import Chats from "./pages/home/Chats";
import Profile from "./pages/home/Profile";
import ProtectedRoute from "./pages/ProtectedRoute/ProtectedRoute";
import ChatDetail from "./pages/home/ChatDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Public />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route element={<ProtectedRoute role="user" />}>
        <Route path="/home" element={<Home />}>
          <Route index element={<Chats />} />
          <Route path="chats/:chatId" element={<ChatDetail />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

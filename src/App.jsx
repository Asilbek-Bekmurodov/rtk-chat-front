import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Public from "./pages/public/Public";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute/ProtectedRoute";
import Home from "./pages/home/Home";
import Chats from "./pages/home/Chats";
import ChatDetail from "./pages/home/ChatDetail";
import Profile from "./pages/home/Profile";
import Invites from "./pages/home/Invites";
import InviteJoin from "./pages/invite/InviteJoin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Public />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/invite/:inviteId" element={<InviteJoin />} />
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route element={<ProtectedRoute role="user" />}>
        <Route path="/home" element={<Home />}>
          <Route index element={<Chats />} />
          <Route path="chats/:chatId" element={<ChatDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="invites" element={<Invites />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

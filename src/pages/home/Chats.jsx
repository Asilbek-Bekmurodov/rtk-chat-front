import React, { useState } from "react";
import {
  useGetChatsQuery,
  useCreateChatMutation,
  useJoinChatMutation,
  useInviteToChatMutation,
} from "../../app/services/chatApi";
import styles from "./Chats.module.css";
import { useNavigate } from "react-router-dom";
import ChatList from "./ChatList";

function Chats() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
  });
  const [joinId, setJoinId] = useState("");
  const [inviteData, setInviteData] = useState({
    chatId: "",
    username: "",
    userId: "",
  });

  const { data: chats, isLoading } = useGetChatsQuery();
  const [createChat] = useCreateChatMutation();
  const [joinChat, { isLoading: isJoining }] = useJoinChatMutation();
  const [inviteToChat, { isLoading: isInviting }] = useInviteToChatMutation();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      await createChat(formData).unwrap();
      setFormData({ title: "" });
    } catch (err) {
      console.error("Create chat error:", err);
    }
  }

  async function handleJoin(e) {
    e.preventDefault();
    const id = joinId.trim();
    if (!id) return;
    try {
      await joinChat(id).unwrap();
      navigate(`/home/chats/${id}`);
      setJoinId("");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleInvite(e) {
    e.preventDefault();
    const chatId = inviteData.chatId.trim();
    const username = inviteData.username.trim();

    if (!chatId || !username) return;
    let payload = { username };
    try {
      await inviteToChat({ chatId, payload }).unwrap();
      setInviteData({ chatId: "", username: "" });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.title}>Create new chat</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            value={formData.title}
            onChange={(e) =>
              setFormData((state) => ({ ...state, title: e.target.value }))
            }
            type="text"
            placeholder="Title"
          />
          <button className={styles.button}>Create</button>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.title}>Join chat</h2>
        <form onSubmit={handleJoin} className={styles.form}>
          <input
            className={styles.input}
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
            type="text"
            placeholder="Chat ID"
          />
          <button className={styles.button} disabled={isJoining}>
            {isJoining ? "Joining..." : "Join"}
          </button>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.title}>Invite to chat</h2>
        <form onSubmit={handleInvite} className={styles.form}>
          <input
            className={styles.input}
            value={inviteData.chatId}
            onChange={(e) =>
              setInviteData((state) => ({ ...state, chatId: e.target.value }))
            }
            type="text"
            placeholder="Chat ID"
          />
          <input
            className={styles.input}
            value={inviteData.username}
            onChange={(e) =>
              setInviteData((state) => ({ ...state, username: e.target.value }))
            }
            type="text"
            placeholder="Username"
          />
          <button className={styles.button} disabled={isInviting}>
            {isInviting ? "Inviting..." : "Send invite"}
          </button>
        </form>
      </div>

      {(isLoading || isInviting || isJoining) && (
        <div className={styles.loading}>Loading...</div>
      )}

      {chats && (
        <div className={styles.chatList}>
          <ChatList chats={chats} />
        </div>
      )}
    </div>
  );
}

export default Chats;

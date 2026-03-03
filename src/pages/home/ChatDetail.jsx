import { useParams, useSearchParams } from "react-router-dom";
import styles from "./ChatDetail.module.css";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import { createSocket, SOCKET_EVENTS } from "../../app/services/socket";

function ChatDetail() {
  const [searchParams] = useSearchParams();
  const { chatId } = useParams();
  const token = useSelector((state) => state?.auth?.token);
  const user = useSelector((state) => state?.auth?.user);

  const socketRef = useRef(null);
  const lastSentRef = useRef([]);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);

  const displayName = useMemo(() => {
    if (user?.username) return user.username;
    if (user?.name) return user.name;
    return "You";
  }, [user]);

  useEffect(() => {
    if (!token) return;
    const socket = createSocket(token);
    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !chatId) return;
    socket.emit(SOCKET_EVENTS.join, chatId);

    return () => {
      socket.emit(SOCKET_EVENTS.leave, chatId);
    };
  }, [chatId, token, displayName, user]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !chatId) return;

    function handleReceive(payload) {
      if (!payload) return;
      const text = payload.text || payload.message || payload.body;
      if (!text) return;
      const sender =
        payload?.sender || payload?.username || payload?.name || "Guest";
      const senderId =
        payload?.senderId || payload?.userId || payload?.user?.id || null;
      const isMineById =
        senderId && (senderId === user?.id || senderId === user?._id);
      const isMineByName =
        sender &&
        displayName &&
        sender.toString().toLowerCase() ===
          displayName.toString().toLowerCase();
      const now = Date.now();
      const recentlySent = lastSentRef.current.some(
        (entry) =>
          entry.text === text &&
          entry.sender === displayName &&
          now - entry.at < 10000,
      );
      if (isMineById || isMineByName || recentlySent) return;

      setMessages((prev) => [
        ...prev,
        {
          id: payload.id || `${Date.now()}-${Math.random()}`,
          text,
          sender,
          mine: false,
          time: payload?.time || new Date().toISOString(),
        },
      ]);
    }

    socket.on(SOCKET_EVENTS.receive, handleReceive);
    return () => {
      socket.off(SOCKET_EVENTS.receive, handleReceive);
    };
  }, [chatId, token]);

  function handleSend() {
    const text = draft.trim();
    if (!text || !chatId) return;

    const payload = {
      chatId,
      text,
      sender: displayName,
      time: new Date().toISOString(),
    };

    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        text,
        sender: displayName,
        mine: true,
        time: payload.time,
      },
    ]);

    lastSentRef.current = [
      ...lastSentRef.current.slice(-19),
      { text, sender: displayName, at: Date.now() },
    ];
    socketRef.current?.emit(SOCKET_EVENTS.send, payload);
    setDraft("");
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>Chat ID: {searchParams.get("title")}</div>

      <div className={styles.messages}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${
              message.mine ? styles.myMessage : styles.message
            }`}
          >
            <p className={styles.messageText}>{message.text}</p>
            <span className={styles.messageMeta}>
              {message.mine ? "You" : message.sender}
            </span>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className={styles.form}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          type="text"
          placeholder="Message..."
          className={styles.input}
        />
        <button className={styles.button}>Send</button>
      </form>
    </div>
  );
}

export default ChatDetail;

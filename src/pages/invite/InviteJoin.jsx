import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useJoinInviteMutation } from "../../app/services/chatApi";
import styles from "./InviteJoin.module.css";

function InviteJoin() {
  const { inviteId } = useParams();
  const token = useSelector((state) => state?.auth?.token) || localStorage.getItem("token");
  const [joinInvite, { isLoading }] = useJoinInviteMutation();
  const [error, setError] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!inviteId) return;

    if (!token) {
      const redirect = encodeURIComponent(location.pathname);
      navigate(`/login?redirect=${redirect}`);
      return;
    }

    if (hasJoined) return;
    setHasJoined(true);

    (async () => {
      try {
        const res = await joinInvite(inviteId).unwrap();
        const chat = res?.chat || res?.data?.chat || res;
        const chatId =
          chat?._id || chat?.id || res?.chatId || res?.data?.chatId || null;

        if (chatId) {
          navigate(`/home/chats/${chatId}`);
          return;
        }

        setError("Chat not found in response");
      } catch (err) {
        setError(err?.data?.message || "Failed to join invite");
      }
    })();
  }, [inviteId, token, joinInvite, navigate, location.pathname, hasJoined]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Joining invite</h2>
        {isLoading && <p className={styles.text}>Please wait...</p>}
        {!isLoading && !error && (
          <p className={styles.text}>Redirecting to chat...</p>
        )}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

export default InviteJoin;

import { doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { NotificationProps } from "pages/notification";
import { useNavigate } from "react-router-dom";
import styles from "./NotificationBox.module.scss";

interface NotificationBoxProps {
  notification: NotificationProps;
}

export default function NotificationBox({
  notification,
}: NotificationBoxProps) {
  const navigate = useNavigate();

  const onClickNotification = async (url: string) => {
    const ref = doc(db, "notifications", notification.id);
    await updateDoc(ref, {
      isRead: true,
    });
    navigate(url);
  };

  return (
    <div className={styles.notification}>
      <div onClick={() => onClickNotification(notification.url)}>
        <div className={styles.notification__flex}>
          <div className={styles.notification__createdAt}>
            {notification.createdAt}
          </div>
          <div className={styles.notification__unread}>
            {!notification.isRead && <div className="notification__unread" />}
          </div>
          <div className="notification__content">{notification.content}</div>
        </div>
      </div>
    </div>
  );
}

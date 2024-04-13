import NotificationBox from "components/notifications/NotificationBox";
import AuthContext from "context/AuthContext";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { useContext, useEffect, useState } from "react";

export interface NotificationProps {
  id: string;
  uid: string;
  url: string;
  isRead: boolean;
  content: string;
  createdAt: string;
}

export default function NotificationPage() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const trans = useTranslation();

  useEffect(() => {
    if (user) {
      let ref = collection(db, "notifications");
      let notificationQuery = query(
        ref,
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      onSnapshot(notificationQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setNotifications(dataObj as NotificationProps[]);
      });
    }
  }, [user]);

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">
          <div className="home__title-text">{trans("MENU_NOTIFICATIONS")}</div>
        </div>
      </div>
      <div className="post">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationBox
              key={notification.id}
              notification={notification}
            />
          ))
        ) : (
          <div className="post__no-posts">
            <div className="post__text">{trans("NO_NOTIFICATIONS")}</div>
          </div>
        )}
      </div>
    </div>
  );
}

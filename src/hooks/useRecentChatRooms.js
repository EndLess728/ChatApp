import { useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import { firebase } from "@react-native-firebase/auth";
import { COLLECTION } from "@/constants/firebaseConstants";

export const useRecentChatRooms = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userUid = firebase.auth().currentUser.uid;

  useEffect(() => {
    if (!userUid) {
      setError("User UID is required");
      setLoading(false);
      return;
    }

    const chatroomsRef = firestore().collection(COLLECTION.CHAT_ROOM);

    // Listen for real-time changes to the CHAT_ROOM collection
    const unsubscribe = chatroomsRef
      .where("users", "array-contains", userUid)
      .onSnapshot(
        (snapshot) => {
          const rooms = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setChatRooms(rooms);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [userUid]);

  return { chatRooms, loading, error };
};

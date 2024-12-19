import { useState, useEffect, useRef } from "react";
import firestore from "@react-native-firebase/firestore";

const useChat = (userId, otherUserId) => {
  const [messages, setMessages] = useState([]);

  // Get the chatroom ID using both user IDs to ensure uniqueness
  const getChatroomId = (user1, user2) => {
    return user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
  };

  // Create a chatroom in Firestore if it doesn't exist
  const createChatroomIfNotExists = async () => {
    const chatroomRef = firestore()
      .collection("CHAT_ROOM")
      .doc(getChatroomId(userId, otherUserId));

    const chatroomDoc = await chatroomRef.get();
    if (!chatroomDoc.exists) {
      // Create a new chatroom with no messages initially
      await chatroomRef.set({
        users: [userId, otherUserId],
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    }
  };

  // Fetch messages from Firestore
  const fetchMessages = () => {
    const chatroomRef = firestore()
      .collection("CHAT_ROOM")
      .doc(getChatroomId(userId, otherUserId))
      .collection("MESSAGES")
      .orderBy("createdAt", "desc");

    return chatroomRef.onSnapshot((snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });
  };

  // Send message to Firestore
  const sendMessage = async (newMessage) => {
    if (newMessage.trim()) {
      const messageToSend = newMessage;

      const chatroomRef = firestore()
        .collection("CHAT_ROOM")
        .doc(getChatroomId(userId, otherUserId));

      await chatroomRef.collection("MESSAGES").add({
        text: messageToSend,
        sender: userId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      await chatroomRef.update({
        lastMessage: messageToSend,
        lastMessageAt: firestore.FieldValue.serverTimestamp(),
      });
    }
  };

  useEffect(() => {
    createChatroomIfNotExists();
    const unsubscribe = fetchMessages();

    return () => {
      // Cleanup listener when component unmounts or dependencies change
      if (unsubscribe) {
        unsubscribe(); // This unsubscribes from Firestore listener
      }
    };
  }, [userId, otherUserId]); // Re-run when userId or otherUserId changes

  return { messages, sendMessage };
};

export default useChat;

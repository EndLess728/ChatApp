import { fonts } from "@/theme";
import { ms } from "@/utils";
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native"; // For fetching the selected user ID
import firestore from "@react-native-firebase/firestore";

export const Conversation = () => {
  const route = useRoute();
  const { userId, otherUserId } = route.params; // Assuming you're passing userId and otherUserId
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef(null); // Reference for FlatList

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

  // Get the chatroom ID using both user IDs to ensure uniqueness
  const getChatroomId = (user1, user2) => {
    return user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
  };

  // Fetch messages from Firestore
  const fetchMessages = () => {
    const chatroomRef = firestore()
      .collection("CHAT_ROOM")
      .doc(getChatroomId(userId, otherUserId))
      .collection("MESSAGES")
      .orderBy("createdAt", "asc");

    chatroomRef.onSnapshot((snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });
  };

  // Send message to Firestore
  const sendMessage = async () => {
    if (newMessage.trim()) {
      const chatroomRef = firestore()
        .collection("CHAT_ROOM")
        .doc(getChatroomId(userId, otherUserId));

      // Add the message to the MESSAGES subcollection
      await chatroomRef.collection("MESSAGES").add({
        text: newMessage,
        sender: userId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // Update the lastMessage field in the chat room document
      await chatroomRef.update({
        lastMessage: newMessage,
        lastMessageAt: firestore.FieldValue.serverTimestamp(), // Optionally track the time of the last message
      });

      setNewMessage(""); // Clear the input field

      // After sending the message, scroll to the bottom
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    createChatroomIfNotExists(); // Ensure the chatroom is created
    fetchMessages(); // Start listening for new messages

    return () => {
      // Cleanup listener on unmount
      const chatroomRef = firestore()
        .collection("CHAT_ROOM")
        .doc(getChatroomId(userId, otherUserId))
        .collection("MESSAGES");
    };
  }, []);

  useEffect(() => {
    // After messages are updated, ensure that the FlatList scrolls to the bottom
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]); // Run this when messages change

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === userId ? styles.user1Message : styles.user2Message,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        ref={flatListRef} // Attach the ref to FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  chatContainer: {
    paddingHorizontal: ms(10),
    paddingTop: ms(10),
    paddingBottom: ms(50), // This ensures there's space at the bottom when you add a new message
  },
  messageContainer: {
    marginVertical: ms(5),
    padding: ms(10),
    borderRadius: ms(10),
    maxWidth: "80%",
  },
  user1Message: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  user2Message: {
    alignSelf: "flex-start",
    backgroundColor: "gray",
  },
  messageText: {
    color: "#fff",
    fontFamily: fonts.openSan.regular,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: ms(10),
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: ms(40),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: ms(20),
    paddingHorizontal: ms(15),
    fontSize: ms(15),
    fontFamily: fonts.openSan.regular,
  },
  sendButton: {
    marginLeft: ms(10),
    backgroundColor: "green",
    borderRadius: ms(20),
    paddingHorizontal: ms(15),
    paddingVertical: ms(8),
  },
  sendButtonText: {
    color: "#fff",
    fontSize: ms(15),
    fontFamily: fonts.openSan.regular,
  },
});

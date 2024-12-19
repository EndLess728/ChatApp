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
import useChat from "@/hooks/useChat";

export const Conversation = () => {
  const route = useRoute();
  const { userId, otherUserId } = route.params;
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef(null);

  const { messages, sendMessage } = useChat(userId, otherUserId);

  const handleSendMessage = () => {
    sendMessage(newMessage); // Send message using the hook
    setNewMessage("");
  };

  // Scroll to the bottom when the messages change
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToIndex({
        index: 0,
        animated: true,
      });
    }
  }, [messages]);

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
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        inverted // This ensures that the messages are shown starting from the bottom
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
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
    paddingBottom: ms(50),
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

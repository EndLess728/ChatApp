import { fonts } from "@/theme";
import { ms } from "@/utils";
import React, { useState } from "react";
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

export const Conversation = () => {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hi there!", sender: "user1" },
    { id: "2", text: "Hello! How are you?", sender: "user2" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prevMessages) => [
        { id: Date.now().toString(), text: newMessage, sender: "user1" },
        ...prevMessages, // Add new messages at the start of the array
      ]);
      setNewMessage("");
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "user1" ? styles.user1Message : styles.user2Message,
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
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        inverted
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

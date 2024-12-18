import { NAVIGATION } from "@/constants";
import { fonts } from "@/theme";
import { ms } from "@/utils";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

const users = [
  {
    id: "1",
    name: "John Doe",
    lastMessage: "Hey, how are you?",
    avatar: "https://via.placeholder.com/50",
  },
  {
    id: "2",
    name: "Jane Smith",
    lastMessage: "Let's catch up later!",
    avatar: "https://via.placeholder.com/50",
  },
  {
    id: "3",
    name: "Michael Brown",
    lastMessage: "Sure, I'll be there.",
    avatar: "https://via.placeholder.com/50",
  },
];

export const ChatList = () => {
  const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate(NAVIGATION.conversation, { userId: item.id })
      }
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatDetails}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: ms(15),
  },
  listContent: {
    paddingVertical: ms(8),
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: ms(12),
    marginVertical: ms(8),
    backgroundColor: "#f9f9f9",
    borderRadius: ms(8),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(25),
    marginRight: ms(12),
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontSize: ms(15),
    fontFamily: fonts.openSan.bold,
    color: "#333",
  },
  chatMessage: {
    fontSize: ms(14),
    color: "#777",
    marginTop: ms(4),
  },
});

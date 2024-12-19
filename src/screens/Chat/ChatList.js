import { Button } from "@/components";
import { NAVIGATION } from "@/constants";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { fonts } from "@/theme";
import { ms } from "@/utils";
import { firebase } from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useRecentChatRooms } from "@/hooks/useRecentChatRooms";
import FullscreenLoader from "@/components/FullScreenLoader";

const DUMMY_PROFILE_IMAGE = "https://via.placeholder.com/50";

export const ChatList = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const user = firebase.auth().currentUser;
  const { data: userList, loading: loadingUserList } =
    useFirestoreCollection("USERS");
  const { chatRooms, loading: loadingChatRooms } = useRecentChatRooms();

  const renderChatItem = ({ item }) => {
    const lastMessage = item.lastMessage || "No message yet";
    const otherUserId = item.users.find((id) => id !== user.uid);
    const otherUser = userList?.find((user) => user.id === otherUserId);

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          navigation.navigate(NAVIGATION.conversation, {
            userId: user.uid,
            otherUserId: otherUserId,
          })
        }
      >
        <Image
          source={{ uri: otherUser?.avatar || DUMMY_PROFILE_IMAGE }}
          style={styles.avatar}
        />
        <View style={styles.chatDetails}>
          <Text style={styles.chatName}>{otherUser?.name}</Text>
          <Text style={styles.chatMessage}>{lastMessage}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderUsers = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        setModalVisible(false);
        navigation.navigate(NAVIGATION.conversation, {
          userId: user.uid,
          otherUserId: item.id,
        });
      }}
    >
      <Image source={{ uri: DUMMY_PROFILE_IMAGE }} style={styles.avatar} />
      <View style={styles.chatDetails}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatMessage}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContent}
      />
      <Button
        title={"Create Chat"}
        style={{ marginVertical: ms(20) }}
        onPress={() => setModalVisible(true)}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)} // Close the modal on back press
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select User to start chat</Text>
              <FlatList
                data={userList?.filter((item) => item.id !== user.uid)}
                keyExtractor={(item) => item.id}
                renderItem={renderUsers}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={() => (
                  <Text style={styles.noUserTitle}>
                    No users Available to chat
                  </Text>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <FullscreenLoader visible={loadingUserList || loadingChatRooms} />
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
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: ms(8),
    padding: ms(20),
  },
  modalTitle: { fontFamily: fonts.openSan.bold, fontSize: ms(15) },
  noUserTitle: {
    fontFamily: fonts.openSan.regularItalic,
    fontSize: ms(12),
  },
});

import { TextStyles } from "@/theme";
import { ms } from "@/utils";
import React from "react";
import { View, ActivityIndicator, Modal, StyleSheet, Text } from "react-native";

const FullscreenLoader = ({ visible = false, size = "large", color }) => {
  return (
    <Modal
      transparent={true}
      statusBarTranslucent // Covers the status bar on android
      animationType="none"
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size={size} color={color || "teal"} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  activityIndicatorWrapper: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: { color: "white", marginTop: ms(10) },
});

export default FullscreenLoader;

import { StyleSheet } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CustomAlert } from "./CustomAlert";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/redux/slices/authSlicer";

const LogoutButton = () => {
  const dispatch = useDispatch();

  return (
    <MaterialIcons
      name="logout"
      size={24}
      color="black"
      onPress={() =>
        CustomAlert({
          message: "Are you sure you want to log out?",
          singleButton: false,
          yesText: "Logout",
          onPressYesButton: () => dispatch(logoutUser()),
        })
      }
    />
  );
};

export default LogoutButton;

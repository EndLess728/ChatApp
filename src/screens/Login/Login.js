import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import auth from "@react-native-firebase/auth";
import FullscreenLoader from "@/components/FullScreenLoader";
import { Button, TextField } from "@/components";
import { saveUserInfo } from "@/redux/slices/authSlicer";
import { NAVIGATION } from "@/constants";
import { fonts } from "@/theme";

export const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        form.email,
        form.password
      );
      dispatch(saveUserInfo(userCredential?.user));
      setForm({ email: "", password: "" });
      console.log("User signed in!");
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthError = (error) => {
    if (error.code === "auth/invalid-credential") {
      alert("The credentials are invalid!");
    } else {
      alert("An error occurred. Please try again.");
    }
    console.error("Auth error: ", error);
  };

  const handleSignupNavigation = () => {
    navigation.navigate(NAVIGATION.signup);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Chat App</Text>
      <View style={styles.inputContainer}>
        <TextField
          autoCapitalize="none"
          onChangeText={(value) => handleInputChange("email", value)}
          placeholder="Enter your email"
          value={form.email}
        />
        <TextField
          secureTextEntry
          autoCapitalize="none"
          onChangeText={(value) => handleInputChange("password", value)}
          placeholder="Enter your password"
          textContentType="password"
          value={form.password}
        />
      </View>
      <Button onPress={handleLogin} style={styles.button} title="Login" />
      <Text style={styles.createAccountBtn} onPress={handleSignupNavigation}>
        Don't have an account? Signup
      </Text>
      <FullscreenLoader visible={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 30,
  },
  screenTitle: {
    fontSize: 30,
    color: "teal",
    fontFamily: fonts.openSan.bold,
    marginBottom: 50,
  },
  inputContainer: {
    width: "90%",
  },
  button: {
    marginHorizontal: 10,
    height: 55,
    marginTop: 20,
  },
  createAccountBtn: {
    fontSize: 15,
    fontFamily: fonts.openSan.semiBold,
    marginTop: 20,
  },
});

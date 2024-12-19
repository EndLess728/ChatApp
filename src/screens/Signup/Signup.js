import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import FullscreenLoader from "@/components/FullScreenLoader";
import { fonts } from "@/theme";
import { Button, TextField } from "@/components";
import {
  validateEmail,
  validatePasswordLength,
} from "@/utils/ValidationFunctions";
import { useNavigation } from "@react-navigation/native";
import { COLLECTION } from "@/constants/firebaseConstants";

export const Signup = () => {
  const [form, setForm] = useState({ userName: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const validateForm = () => {
    if (!form.userName || form.userName.trim() === "")
      return "Please enter your user name";
    if (!form.email) return "Please enter your email";
    if (!validateEmail(form.email)) return "Email is not valid";
    if (!form.password) return "Please enter your password";
    if (!validatePasswordLength(form.password))
      return "Password must be at least 6 characters";
    return null;
  };

  const createUserInFirestore = async (user) => {
    try {
      await firestore().collection(COLLECTION.USERS).doc(user.uid).set({
        email: user.email,
        uid: user.uid,
        name: form.userName,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log("User added to Firestore!");
    } catch (error) {
      console.error("Error adding user to Firestore: ", error);
      throw new Error("Could not save user details. Please try again.");
    }
  };

  const handleSignup = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        form.email,
        form.password
      );
      await createUserInFirestore(userCredential.user);
      console.log("User account created!");
      alert("User account created successfully");
      setForm({ email: "", password: "" });
      navigation.goBack();
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthError = (error) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        alert("That email address is already in use!");
        break;
      case "auth/invalid-email":
        alert("That email address is invalid!");
        break;
      default:
        alert("An error occurred. Please try again.");
    }
    console.error("Auth error: ", error);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Chat App</Text>
      <View style={styles.inputContainer}>
        <TextField
          autoCapitalize="none"
          onChangeText={(value) => handleInputChange("userName", value)}
          placeholder="Enter user name"
          value={form.userName}
        />
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
      <Button onPress={handleSignup} style={styles.button} title="Signup" />
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
  },
  inputContainer: {
    width: "90%",
  },
  button: {
    marginHorizontal: 10,
    height: 55,
    marginTop: 20,
  },
});

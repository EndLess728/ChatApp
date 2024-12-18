import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { fonts } from "@/theme";
import { Button, TextField } from "@/components";
import auth from "@react-native-firebase/auth";
import FullscreenLoader from "@/components/FullScreenLoader";
import {
  validateEmail,
  validatePasswordLength,
} from "@/utils/ValidationFunctions";
export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSignup = () => {
    if (email == "") {
      alert("Please enter your email");
    } else if (!validateEmail(email)) {
      alert("Email is not valid");
    } else if (password == "") {
      alert("Please enter your password");
    } else if (!validatePasswordLength(password)) {
      alert("Password must be at least of 6 characters");
    } else {
      setIsLoading(true);
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then((resp) => {
          console.log("print JSON response ==>", JSON.stringify(resp));
          setIsLoading(false);
          setEmail("");
          setPassword("");
          console.log("User account created & signed in!");
        })
        .catch((error) => {
          setIsLoading(false);
          if (error.code === "auth/email-already-in-use") {
            console.log("That email address is already in use!");
            alert("That email address is already in use!");
          }

          if (error.code === "auth/invalid-email") {
            console.log("That email address is invalid!");
            alert("That email address is invalid!");
          }

          console.error(error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Chat App</Text>
      <View style={{ width: "90%" }}>
        <TextField
          autoCapitalize="none"
          onChangeText={setEmail}
          placeholder={"Enter your email"}
          value={email}
        />
        <TextField
          secureTextEntry
          autoCapitalize="none"
          onChangeText={setPassword}
          placeholder={"Enter your password"}
          textContentType="password"
          value={password}
        />
      </View>

      <Button onPress={onSignup} style={styles.button} title={"Signup"} />

      <FullscreenLoader visible={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  button: { marginHorizontal: 10, height: 55, marginTop: 20 },
  screenTitle: {
    fontSize: 30,
    color: "teal",
    fontFamily: fonts.openSan.bold,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 30,
  },
});

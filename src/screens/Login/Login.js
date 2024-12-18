import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { fonts } from "@/theme";
import { Button, TextField } from "@/components";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "@/constants";
import auth from "@react-native-firebase/auth";
import FullscreenLoader from "@/components/FullScreenLoader";
import { useDispatch } from "react-redux";
import { saveUserInfo } from "@/redux/slices/authSlicer";
export const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onLogin = () => {
    setIsLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((resp) => {
        dispatch(saveUserInfo(resp?.user));
        setIsLoading(false);
        setEmail("");
        setPassword("");
        console.log("signed in!");
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.code === "auth/invalid-credential") {
          console.log("The credentials are invalid!");
          alert("The credentials are invalid!");
        }

        console.error(error);
      });
  };

  const onCreateAccount = () => {
    navigation.navigate(NAVIGATION.signup);
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

      <Button onPress={onLogin} style={styles.button} title={"Login"} />

      <Text style={styles.createAccountBtn} onPress={onCreateAccount}>
        Don't have account? Signup
      </Text>

      <FullscreenLoader visible={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  createAccountBtn: {
    fontSize: 15,
    fontFamily: fonts.openSan.semiBold,
    marginTop: 20,
  },
  button: { marginHorizontal: 10, height: 55, marginTop: 20 },
  screenTitle: {
    fontSize: 30,
    color: "teal",
    fontFamily: fonts.openSan.bold,
    marginBottom: 50,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 30,
  },
});

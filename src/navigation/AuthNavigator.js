import React from "react";
import { NAVIGATION } from "@/constants";
import { Login, Signup } from "@/screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Login}
        name={NAVIGATION.login}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        component={Signup}
        name={NAVIGATION.signup}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
}

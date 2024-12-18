import React from "react";
import { NAVIGATION } from "@/constants";
import { ChatList, Conversation, Login, Signup } from "@/screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={ChatList}
        name={NAVIGATION.chatList}
        options={{
          headerShown: true,
          headerTitle: "Chats",
          headerRight: () => (
            <TouchableOpacity onPress={() => alert("pressed logout")}>
              <Text>Logout</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        component={Conversation}
        name={NAVIGATION.conversation}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
}

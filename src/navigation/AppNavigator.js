import React from "react";
import { NAVIGATION } from "@/constants";
import { ChatList, Conversation } from "@/screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogoutButton from "@/components/LogoutButton";

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
          headerRight: () => <LogoutButton />,
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

import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffc629",
        headerStyle: {
          // backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          // backgroundColor: "#25292e",
        },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null, headerShown: false }} />

      <Tabs.Screen
        name="interview"
        options={{
          title: "Interviews",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "chatbubbles" : "chatbubbles-outline"} color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="job-position"
        options={{
          title: "Job Positions",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "briefcase" : "briefcase-outline"} color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="career-profile"
        options={{
          title: "Career Tracks",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "trending-up" : "trending-up-outline"} color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name={"settings-outline"} color={color} size={28} />,
        }}
      />
    </Tabs>
  );
}

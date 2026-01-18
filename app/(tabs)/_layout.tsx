import { useUiStore } from "@/lib/storage/uiStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Platform, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const { hasOpenedJobPositions, hasOpenedInterviews, hasOpenedCareerProfiles, hasOpenedAccount } = useUiStore();

  const isWebSidebar = Platform.OS === "web" && width >= 768;
  return (
    <>
      {isWebSidebar && (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Drawer>
            <Drawer.Screen
              name="index" // must match the page/route file name
              options={{
                drawerLabel: "Home",
                title: "overview",
                drawerItemStyle: { display: "none" },
              }}
            />

            <Drawer.Screen
              name="interview"
              options={{
                drawerLabel: "Interviews",
                title: "Interviews",
                drawerIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" size={size} color={color} />,
              }}
            />

            <Drawer.Screen
              name="job-position"
              options={{
                drawerLabel: "Job Positions",
                title: "Job Positions",
                drawerIcon: ({ color, size }) => <Ionicons name="briefcase-outline" size={size} color={color} />,
              }}
            />

            <Drawer.Screen
              name="career-profile"
              options={{
                drawerLabel: "Career Profiles",
                title: "Career Profiles",
                drawerIcon: ({ color, size }) => <Ionicons name="trending-up-outline" size={size} color={color} />,
              }}
            />

            <Drawer.Screen
              name="account"
              options={{
                drawerLabel: "Account",
                title: "Account",
                drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
              }}
            />
          </Drawer>
        </GestureHandlerRootView>
      )}

      {!isWebSidebar && (
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#ffc629",
            headerShadowVisible: false,
            headerTintColor: "#fff",
            tabBarBadgeStyle: { right: -10 },
          }}
        >
          <Tabs.Screen name="index" options={{ href: null, headerShown: false }} />

          <Tabs.Screen
            name="interview"
            options={{
              title: "Interviews",
              tabBarBadge: hasOpenedInterviews ? undefined : "",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? "chatbubbles" : "chatbubbles-outline"} color={color} size={28} />
              ),
            }}
          />
          <Tabs.Screen
            name="job-position"
            options={{
              title: "Job Positions",
              tabBarBadge: hasOpenedJobPositions ? undefined : "",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "briefcase" : "briefcase-outline"} color={color} size={28} />,
            }}
          />
          <Tabs.Screen
            name="career-profile"
            options={{
              title: "Career Profiles",
              tabBarBadge: hasOpenedCareerProfiles ? undefined : "",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? "trending-up" : "trending-up-outline"} color={color} size={28} />
              ),
            }}
          />
          <Tabs.Screen
            name="account"
            options={{
              title: "Account",
              tabBarBadge: hasOpenedAccount ? undefined : "",
              headerShown: false,
              tabBarIcon: ({ color }) => <Ionicons name={"settings-outline"} color={color} size={28} />,
            }}
          />
        </Tabs>
      )}
    </>
  );
}

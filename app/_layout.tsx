import { Stack } from "expo-router";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

import "@/global.css";


export default function RootLayout() {
  return (
      <GluestackUIProvider mode={"system"}>
        <Stack>
          {/* Include /auth routes */}
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          {/* Main tabs group */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </GluestackUIProvider>
  );
}

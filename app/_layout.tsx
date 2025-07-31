import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { useAuthStore } from "@/lib/supabase/authStore";
import { supabase } from "@/lib/supabase/supabase";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const { isLogged, hasCompletedOnboarding, updateSession, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // hides the splace when the storage is Hydrated & syncs supabase with auth storage
    if (_hasHydrated) {
      SplashScreen.hideAsync();
      supabase.auth.getSession().then(({ data: { session } }) => updateSession(session));
      supabase.auth.onAuthStateChange((_event, session) => updateSession(session));
    }
  }, [_hasHydrated]);

  if (!_hasHydrated) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode={"system"}>
        <ActionSheetProvider>
          <Stack>
            <Stack.Protected guard={!isLogged}>
              <Stack.Screen name="auth" options={{ headerShown: false }} />
            </Stack.Protected>

            <Stack.Protected guard={isLogged}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack.Protected>
          </Stack>
        </ActionSheetProvider>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { useAuthStore } from "@/lib/supabase/authStore";
import { supabase } from "@/lib/supabase/supabase";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isLogged, hasCompletedOnboarding, updateSession, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // syncs supabase with auth storage
    supabase.auth.getSession().then(({ data: { session } }) => updateSession(session));
    supabase.auth.onAuthStateChange((_event, session) => updateSession(session));
  }, []);

  useEffect(() => {
    // hides the splace when the storage is Hydrated
    if (_hasHydrated) SplashScreen.hideAsync();
  }, [_hasHydrated]);

  if (!_hasHydrated) {
    return null;
  }

  return (
    <GluestackUIProvider mode={"system"}>
      <Stack>
        <Stack.Protected guard={!isLogged}>
          <Stack.Screen name="auth" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={isLogged}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </GluestackUIProvider>
  );
}

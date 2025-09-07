import { useAuthStore } from "@/lib/supabase/authStore";
import { supabase } from "@/lib/supabase/supabase";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";
import { IconArrowForward, IconGoogle } from "../misc/StyledIcons";
import { Box } from "../ui/box";
import { Button, ButtonText } from "../ui/button";
import { Text } from "../ui/text";

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

export default function SupabaseAuth() {
  const router = useRouter();
  const { logInWithSession } = useAuthStore();

  if (!webClientId) return null;

  const redirectUrl = `${window?.location?.protocol}//${window?.location?.host}/auth`;

  const handleGoogleLogin = async () => {
    const req = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl },
    });
    if (req.error) Alert.alert("OAuth error:", req.error.message);
  };

  useEffect(() => {
    (async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace(/^#/, ""));
      const accessToken = params.get("access_token") ?? "";
      const refreshToken = params.get("refresh_token") ?? "";
      if (accessToken) {
        await logInWithSession(accessToken, refreshToken);
        router.replace("/");
      }
    })();
  }, [window.location.hash]);

  return (
    <Button size="xl" action="primary" className="flex-row items-center justify-center" onPress={handleGoogleLogin}>
      <ButtonText className="ml-2">
        <Box className="flex flex-row place-items-center gap-1">
          <IconGoogle />
          <Text className="flex-1 text-base font-bold dark:text-white text-gray-900 tracking-wide">Continue with Google</Text>
          <IconArrowForward />
        </Box>
      </ButtonText>
    </Button>
  );
}

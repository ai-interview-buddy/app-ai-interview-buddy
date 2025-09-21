import { useAuthStore } from "@/lib/supabase/authStore";
import { supabase } from "@/lib/supabase/supabase";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, Image, Text } from "react-native";
import { IconArrowForward } from "../misc/StyledIcons";
import { Box } from "../ui/box";
import { Button, ButtonText } from "../ui/button";

export default function AppleAuth() {
  const router = useRouter();
  const { logInWithSession } = useAuthStore();

  const handleAppleWebLogin = async () => {
    console.log("starting apple web login");
    const redirectUrl = window?.location?.protocol
      ? `${window?.location?.protocol}//${window?.location?.host}/auth`
      : `https://app.aiinterviewbuddy.com/auth`;

    const req = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo: redirectUrl },
    });
    if (req.error) Alert.alert("OAuth error:", req.error.message);
  };

  useEffect(() => {
    (async () => {
      const hash = window?.location?.hash;
      const params = new URLSearchParams(hash.replace(/^#/, ""));
      const accessToken = params.get("access_token") ?? "";
      const refreshToken = params.get("refresh_token") ?? "";
      if (accessToken) {
        await logInWithSession(accessToken, refreshToken);
        router.replace("/");
      }
    })();
  }, [window?.location?.hash]);

  return (
    <Button
      size="xl"
      action="primary"
      style={{ backgroundColor: "black" }}
      className="flex-row items-center justify-center"
      onPress={handleAppleWebLogin}
    >
      <ButtonText className="ml-2">
        <Box className="flex flex-row place-items-center gap-1">
          <Image
            source={require("@/assets/images/apple-icon.png")}
            style={{
              width: 28,
              height: 28,
              marginRight: 6,
            }}
          />
          <Text className="flex-1 text-base font-bold text-white tracking-wide">Continue with Apple Web</Text>
          <IconArrowForward color="white" />
        </Box>
      </ButtonText>
    </Button>
  );
}

AppleAuth.displayName = "AppleAuth";

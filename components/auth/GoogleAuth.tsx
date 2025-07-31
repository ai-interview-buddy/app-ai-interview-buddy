import { Button, ButtonText } from "@/components/ui/button";
import { useAuthStore } from "@/lib/supabase/authStore";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { IconArrowForward, IconGoogle } from "../misc/StyledIcons";
import { Box } from "../ui/box";
import { Text } from "../ui/text";

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

export default function GoogleAuth() {
  const router = useRouter();
  const { logInWithIdToken } = useAuthStore();

  if (!webClientId) return null;

  GoogleSignin.configure({
    scopes: ["email", "profile"],
    webClientId: webClientId,
    iosClientId: iosClientId,
  });

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await logInWithIdToken("google", userInfo.data?.idToken ?? "");
      router.replace("/");
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.prompt("Error: sign in cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.prompt("Error: in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.prompt("Error: play services not available");
      } else {
        Alert.prompt("Error: " + error);
      }
    }
  };

  return (
    <Button size="xl" action="primary" className="flex-row items-center justify-center" onPress={signIn}>
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

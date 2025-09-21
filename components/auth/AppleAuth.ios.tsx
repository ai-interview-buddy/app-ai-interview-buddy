import { useAuthStore } from "@/lib/supabase/authStore";
import { supabase } from "@/lib/supabase/supabase";
import * as AppleAuthentication from "expo-apple-authentication";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, useColorScheme } from "react-native";

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

export default function AppleAuth() {
  const router = useRouter();
  const { logInWithSession } = useAuthStore();
  const theme = useColorScheme();

  if (!webClientId) return null;

  const handleIosNativeLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });

      // Sign in via Supabase Auth.
      if (credential.identityToken) {
        const {
          error,
          data: { user },
        } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: credential.identityToken,
        });

        console.error(JSON.stringify({ error, user }, null, 2));

        if (!error) {
          // User is signed in.
        }
      } else {
        throw new Error("No identityToken.");
      }
    } catch (e: any) {
      if (e?.code === "ERR_REQUEST_CANCELED") {
        Alert.alert("OAuth error:", "Login canceled");
      } else {
        Alert.alert("OAuth error:", e?.message);
      }
    }
  };

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={
        theme === "dark"
          ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
          : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
      }
      cornerRadius={5}
      style={styles.button}
      onPress={handleIosNativeLogin}
    />
  );
}
const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 44,
  },
});

AppleAuth.displayName = "AppleAuth";

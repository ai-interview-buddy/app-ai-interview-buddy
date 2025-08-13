import { ConfigContext, ExpoConfig } from "expo/config";
const withForegroundService = require("./android-manifest.plugin");

const iosUrlScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME;

export default ({ config }: ConfigContext): ExpoConfig => {
  const googleSignInPlugin: [string, any] = ["@react-native-google-signin/google-signin", { iosUrlScheme: iosUrlScheme }];

  const next = {
    ...config,
    name: "AI Interview Buddy",
    slug: "app-ai-interview-buddy",
    plugins: [
      ...(config.plugins ?? []), // load default plugins
      googleSignInPlugin, // inject google with iosUrlScheme
    ],
  };

  return withForegroundService(next);
};

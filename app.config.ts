import { ConfigContext, ExpoConfig } from "expo/config";

const iosUrlScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME;

export default ({ config }: ConfigContext): ExpoConfig => {
  const googleSignInPlugin: [string, any] = ["@react-native-google-signin/google-signin", { iosUrlScheme: iosUrlScheme }];

  return {
    ...config,
    name: "app-ai-interview-buddy",
    slug: "app-ai-interview-buddy",
    plugins: [
      ...(config.plugins ?? []), // load default plugins
      googleSignInPlugin, // inject google with iosUrlScheme
    ],
  };
};

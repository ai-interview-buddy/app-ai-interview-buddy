import { PostHogProvider } from "posthog-react-native";
import { Analytics } from "./Analytics";

export const AnalyticsProvider = ({ children }) => {
  const posthogApiUrl = process.env.EXPO_PUBLIC_POSTHOG_API_URL;
  const posthogApiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;

  if (!posthogApiKey || !posthogApiUrl) {
    if (__DEV__) {
      console.warn("PostHog disabled: missing EXPO_PUBLIC_POSTHOG_API_URL or EXPO_PUBLIC_POSTHOG_API_KEY");
    }
    return <>{children}</>;
  }

  return (
    <PostHogProvider
      apiKey={posthogApiKey}
      options={{
        host: posthogApiUrl,
        enableSessionReplay: true,
        sessionReplayConfig: {
          maskAllTextInputs: true,
          maskAllImages: true,
          maskAllSandboxedViews: true,
          captureLog: true,
          captureNetworkTelemetry: true,
          throttleDelayMs: 1000,
        },
      }}
    >
      {children}
      <Analytics />
    </PostHogProvider>
  );
    >
      {children}
      <Analytics />
    </PostHogProvider>
  );
};

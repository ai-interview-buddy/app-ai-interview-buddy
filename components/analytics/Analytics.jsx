import { useAuthStore } from "@/lib/supabase/authStore";
import { useGlobalSearchParams, usePathname } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect, useRef, useState } from "react";

export const Analytics = () => {
  const posthog = usePostHog();
  const { user, isLogged, _hasHydrated } = useAuthStore();
  const prevIsLoggedRef = useRef(isLogged);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const pathname = usePathname();
  const params = useGlobalSearchParams();

  // Navigation tracking
  useEffect(() => {
    if (posthog) {
      posthog.screen(pathname, { params });
    }
  }, [pathname, params, posthog]);

  // Identity synchronization
  useEffect(() => {
    if (!_hasHydrated || !posthog) return;

    if (isLogged && user) {
      if (initialCheckDone && !prevIsLoggedRef.current) {
        // Only alias on transition from logged out to logged in (login/signup)
        posthog.alias(user.id);
      }
      posthog.identify(user.id);
    } else if (!isLogged && prevIsLoggedRef.current) {
      posthog.reset();
    }

    if (!initialCheckDone) setInitialCheckDone(true);
    prevIsLoggedRef.current = isLogged;
  }, [isLogged, user?.id, _hasHydrated, initialCheckDone, posthog]);

  return <></>;
};

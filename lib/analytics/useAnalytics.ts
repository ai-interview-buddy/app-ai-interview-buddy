import { usePostHog } from "posthog-react-native";
import { useCallback } from "react";

export const AnalyticsEvents = {
  // Onboarding
  ONBOARDING_STEP_VIEWED: "onboarding_step_viewed",
  ONBOARDING_SKIPPED: "onboarding_skipped",
  ONBOARDING_COMPLETED: "onboarding_completed",

  // Account
  ACCOUNT_CREATED: "account_created",

  // CV
  CV_UPLOADED: "cv_uploaded",

  // Mock Interview
  MOCK_INTERVIEW_STARTED: "mock_interview_started",
  MOCK_INTERVIEW_COMPLETED: "mock_interview_completed",

  // Real Interview - Record
  INTERVIEW_RECORDING_STARTED: "interview_recording_started",
  INTERVIEW_RECORDING_COMPLETED: "interview_recording_completed",

  // Real Interview - Upload
  INTERVIEW_UPLOAD_COMPLETED: "interview_upload_completed",

  // Interview Tutorial
  INTERVIEW_TUTORIAL_STEP_VIEWED: "interview_tutorial_step_viewed",
  INTERVIEW_TUTORIAL_COMPLETED: "interview_tutorial_completed",
} as const;

type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export const useAnalytics = () => {
  const posthog = usePostHog();

  const capture = useCallback(
    (event: AnalyticsEventName, properties?: Record<string, any>) => {
      if (posthog) {
        posthog.capture(event, properties);
      }
    },
    [posthog]
  );

  return { capture };
};

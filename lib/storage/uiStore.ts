import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UiState = {
  hasOpenedJobPositions: boolean;
  hasOpenedInterviews: boolean;
  hasOpenedCareerProfiles: boolean;
  hasOpenedWebVersion: boolean;
  hasOpenedFeedback: boolean;
  hasOpenedAccount: boolean;
  hasDoneInterviewTutorial: boolean;
  markAsOpened: (key: keyof Omit<UiState, "markAsOpened">) => void;
};

export const useUiStore = create(
  persist<UiState>(
    (set) => ({
      hasOpenedJobPositions: false,
      hasOpenedInterviews: false,
      hasOpenedCareerProfiles: false,
      hasOpenedWebVersion: false,
      hasOpenedFeedback: false,
      hasOpenedAccount: false,
      hasDoneInterviewTutorial: false,
      markAsOpened: (key) =>
        set((state) => ({
          ...state,
          [key]: true,
        })),
    }),
    {
      name: "ui-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

import { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storageDeleteItemAsync, storageGetItem, storageSetItem } from "../storage/storage";
import {
  supabaseConvertSessionToUserInfo,
  supabaseGetSession,
  supabaseSignIn,
  supabaseSignInWithIdToken,
  supabaseSignInWithSession,
  supabaseSignOut,
} from "./supabaseLogin";

export type UserInfo = {
  accessToken: string;
  name: string;
  avatar?: string;
  expiresAt?: number;
};

type UserState = {
  isLogged: boolean;
  user?: UserInfo;
  shouldCreateAccount: boolean;
  hasCompletedOnboarding: boolean;
  _hasHydrated: boolean;
  logIn: (email: string, password: string) => Promise<void>;
  logInWithIdToken: (provider: string, token: string) => Promise<void>;
  logInWithSession: (accessToken: string, refreshToken: string) => Promise<void>;
  logOut: () => void;
  getSession: () => Promise<Session | null>;
  updateSession: (session: Session | null) => Promise<void>;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create(
  persist<UserState>(
    (set) => ({
      isLogged: false,
      shouldCreateAccount: false,
      hasCompletedOnboarding: false,
      isVip: false,
      _hasHydrated: false,
      logIn: async (email: string, password: string) => {
        const { success, session } = await supabaseSignIn(email, password);
        if (success) {
          set((state) => {
            return { ...state, isLogged: success, user: supabaseConvertSessionToUserInfo(session!!) };
          });
        }
      },
      logInWithIdToken: async (provider: string, token: string) => {
        const { success, session } = await supabaseSignInWithIdToken(provider, token);
        if (success) {
          set((state) => {
            return { ...state, isLogged: success, user: supabaseConvertSessionToUserInfo(session!!) };
          });
        }
      },
      logInWithSession: async (accessToken: string, refreshToken: string) => {
        const { success, session } = await supabaseSignInWithSession(accessToken, refreshToken);
        if (success) {
          set((state) => {
            return { ...state, isLogged: success, user: supabaseConvertSessionToUserInfo(session!!) };
          });
        }
      },
      logOut: async () => {
        await supabaseSignOut();
        set((state) => {
          return { ...state, isLogged: false, user: undefined };
        });
      },
      getSession: async () => await supabaseGetSession(),
      updateSession: async (session: Session | null): Promise<void> => {
        const isLogged: boolean = session?.user ? true : false;
        const user = isLogged ? supabaseConvertSessionToUserInfo(session!!) : undefined;
        set((state) => {
          return { ...state, isLogged: isLogged, user: user };
        });
      },
      completeOnboarding: () => {
        set((state) => {
          return { ...state, hasCompletedOnboarding: true };
        });
      },
      resetOnboarding: () => {
        set((state) => {
          return { ...state, hasCompletedOnboarding: false };
        });
      },
      setHasHydrated: (value: boolean) => {
        set((state) => {
          return { ...state, _hasHydrated: value };
        });
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => ({
        getItem: storageGetItem,
        setItem: storageSetItem,
        removeItem: storageDeleteItemAsync,
      })),
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    }
  )
);

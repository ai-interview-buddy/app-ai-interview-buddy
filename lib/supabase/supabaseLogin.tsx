import { Session, User } from "@supabase/supabase-js";
import { UserInfo } from "./authStore";
import { supabase } from "./supabase";

type SignInResult = {
  success: boolean;
  user?: User;
  session?: Session;
};

export async function supabaseSignIn(email: string, password: string): Promise<SignInResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error signing in:", error);
    return { success: false };
  }

  if (data.session) {
    console.log("User signed in:", data.user);
    return { success: true, user: data.user, session: data.session };
  } else {
    console.error("No user returned from sign in");
    return { success: false };
  }
}

export async function supabaseSignInWithIdToken(provider: string, token: string): Promise<SignInResult> {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: provider,
    token: token,
  });

  if (error) {
    console.error("Error signing in:", error);
    return { success: false };
  }

  if (data.session) {
    console.log("User signed in:", data.user);
    return { success: true, user: data.user, session: data.session };
  } else {
    console.error("No user returned from sign in");
    return { success: false };
  }
}

export async function supabaseSignInWithSession(accessToken: string, refreshToken: string): Promise<SignInResult> {
  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    console.error("Error signing in:", error);
    return { success: false };
  }

  if (data.session) {
    console.log("User signed in:", data.user);
    return { success: true, user: data.user ?? undefined, session: data.session };
  } else {
    console.error("No user returned from sign in");
    return { success: false };
  }
}

export async function supabaseGetSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error signing out:", error);
    return null;
  } else {
    return data.session;
  }
}

export async function supabaseSignOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
    return;
  } else {
    console.log("User signed out");
  }
}

export function supabaseConvertSessionToUserInfo(session: Session): UserInfo {
  return {
    id: session.user.id,
    name: session.user.user_metadata.name,
    accessToken: session.access_token,
    avatar: session.user.user_metadata.avatar_url,
    expiresAt: session.expires_at,
  };
}

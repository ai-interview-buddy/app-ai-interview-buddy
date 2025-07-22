import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export async function storageSetItem(k: string, v: string): Promise<void> {
  if (Platform.OS === "web" && typeof localStorage !== "undefined") {
    localStorage.setItem(k, v);
  }

  if (Platform.OS === "ios" || Platform.OS === "android") {
    await SecureStore.setItemAsync(k, v.toString());
  }
}

export async function storageGetItem(k: string): Promise<string | null> {
  if (Platform.OS === "web" && typeof localStorage !== "undefined") {
    return localStorage.getItem(k);
  }

  if (Platform.OS === "ios" || Platform.OS === "android") {
    return await SecureStore.getItemAsync(k);
  }

  return null;
}

export async function storageDeleteItemAsync(k: string): Promise<void> {
  if (Platform.OS === "web" && typeof localStorage !== "undefined") {
    return localStorage.removeItem(k);
  }

  if (Platform.OS === "ios" || Platform.OS === "android") {
    return await SecureStore.deleteItemAsync(k);
  }
}

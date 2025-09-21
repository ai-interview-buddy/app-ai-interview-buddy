import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

export function IconArrowForward({ color = undefined }: { color?: string }) {
  const colorScheme = useColorScheme();
  const actualColor = color ? color : colorScheme === "dark" ? "#FFF" : "#1D252C";
  return <Ionicons name="arrow-forward" size={20} color={actualColor} />;
}

export function IconGoogle() {
  return <Ionicons name="logo-google" size={24} color="#ea4335" />;
}

export function IconLinkedIn() {
  return <Ionicons name="logo-linkedin" size={24} color="#0077b5" />;
}

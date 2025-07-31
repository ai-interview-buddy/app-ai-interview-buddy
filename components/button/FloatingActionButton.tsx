import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

type FloatingActionButton = {
  onPress?: () => Promise<void>;
};

export const FloatingActionButton = ({ onPress }: FloatingActionButton) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: "absolute",
        bottom: 30,
        right: 20,
        width: 56,
        height: 56,
        backgroundColor: "#FFC629",
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <Ionicons name="add" size={32} color="#1D252C" />
    </TouchableOpacity>
  );
};

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  pageTitle: string;
  handleCancel?: () => void;
  handleBack?: () => void;
};

export function TitleBackHeader({ pageTitle, handleCancel, handleBack }: Props) {
  const router = useRouter();

  const defaultBack = () => router.back();

  const handleCancelAction = () => {
    if (handleCancel) {
      handleCancel();
    } else {
      defaultBack();
    }
  };

  const handleBackAction = () => {
    if (handleBack) {
      handleBack();
    } else {
      defaultBack();
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
      }}
    >
      <TouchableOpacity
        onPress={handleBackAction}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 1,
        }}
      >
        <Ionicons name="chevron-back" size={24} color="#1D252C" />
      </TouchableOpacity>

      <Text
        numberOfLines={1}
        style={{
          flex: 1,
          fontSize: 18,
          fontWeight: "700",
          color: "#1D252C",
          textAlign: "center",
          marginHorizontal: 8,
        }}
      >
        {pageTitle}
      </Text>

      <TouchableOpacity onPress={handleCancelAction} style={{ paddingVertical: 8, paddingHorizontal: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#6B7280",
          }}
        >
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );
}

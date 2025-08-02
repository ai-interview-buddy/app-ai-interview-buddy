import React, { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type MainActionProps = {
  disabled?: boolean;
  isLoading?: boolean;
  children?: ReactNode;
  loadingText?: ReactNode;
  onPress: () => Promise<void>;
};

export const MainAction = ({
  disabled = false,
  isLoading = false,
  children = <>Save</>,
  loadingText = <>Analyzing CV...</>,
  onPress,
}: MainActionProps) => {
  const isActive = !disabled && !isLoading;

  const backgroundColor = isActive ? "#FFC629" : isLoading ? "#FFD876" : "#E5E7EB";
  const textColor = disabled ? "#9CA3AF" : "#1D252C";

  const shadowOpacity = isActive ? 0.3 : 0;
  const elevation = isActive ? 4 : 0;
  const buttonOpacity = isLoading ? 0.7 : 1;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        width: "100%",
        backgroundColor,
        borderRadius: 16,
        paddingVertical: 18,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#FFC629",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity,
        shadowRadius: 8,
        elevation,
        opacity: buttonOpacity,
      }}
    >
      {isLoading ? (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: textColor,
              marginRight: 12,
            }}
          >
            {loadingText}
          </Text>
        </View>
      ) : (
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: textColor,
          }}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import { ButtonMainProps } from "./ButtonMain";

export const ButtonDanger = ({ label, icon = "trash-outline", visible, disabled, flex, onPress }: ButtonMainProps) => {
  if (visible == false) return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        flex: flex == false ? undefined : flex,
        backgroundColor: "#FEF2F2",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {icon && <Ionicons name={icon} size={20} color="#EF4444" style={label ? { marginRight: 8 } : {}} />}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: "#EF4444",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

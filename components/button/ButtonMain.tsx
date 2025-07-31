import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

export type ButtonMainProps = {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  visible?: boolean;
  disabled?: boolean;
  flex?: number | false;
  onPress?: () => void;
};

export const ButtonMain = ({ label, icon, disabled = false, visible, onPress, flex = 1 }: ButtonMainProps) => {
  if (visible == false) return null;

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{
        flex: flex == false ? undefined : flex,
        backgroundColor: "#FFC629",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {icon && <Ionicons name={icon} size={20} color="#1D252C" style={label ? { marginRight: 8 } : {}} />}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: "#1D252C",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { ButtonMainLinkProps, ButtonMainProps } from "./ButtonMain";

export const ButtonDefaultLink = ({ label, icon, disabled = false, visible, href, flex = 1 }: ButtonMainLinkProps) => {
  return (
    <Link href={href} push asChild>
      <ButtonDefault label={label} icon={icon} disabled={disabled} visible={visible} flex={flex} />
    </Link>
  );
};

export const ButtonDefault = ({ label, onPress, icon, visible, disabled, flex = 1 }: ButtonMainProps) => {
  if (visible == false) return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        flex: flex == false ? undefined : flex,
        backgroundColor: "#F8F9FA",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {icon && <Ionicons name={icon} size={20} color="#6B7280" style={label ? { marginRight: 8 } : {}} />}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: "#6B7280",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

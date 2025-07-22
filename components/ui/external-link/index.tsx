import React from "react";
import { Linking, Platform, Text } from "react-native";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function ExternalLink({ href, children, className }: Props) {
  if (Platform.OS === "web") {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={{ textDecorationLine: "underline" }}>
        {children}
      </a>
    );
  }

  return (
    <Text onPress={() => Linking.openURL(href)} className={className} style={{ textDecorationLine: "underline" }}>
      {children}
    </Text>
  );
}

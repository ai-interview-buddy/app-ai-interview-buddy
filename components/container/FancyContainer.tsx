import { ReactNode } from "react";
import { Dimensions, StatusBar, View, useColorScheme } from "react-native";

import { LinearGradient } from "@/components/ui/linear-gradient";

type Props = {
  children: ReactNode;
};

export function FancyContainer({ children }: Props) {
  const colorScheme = useColorScheme();
  const barStyle = colorScheme === "dark" ? "light-content" : "dark-content";

  const { height } = Dimensions.get("window");

  return (
    <View className="flex-1 relative bg-gray-900 dark:bg-white overflow-hidden w-full">
      <StatusBar barStyle={barStyle} />

      <LinearGradient
        colors={colorScheme === "dark" ? ["#1D252C", "#2A3440", "#1D252C"] : ["#FEFBED", "#FFF7DE", "#FEFBED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />

      <View className="absolute rounded-full opacity-20 bg-yellow-400 w-52 h-52 -top-12 -right-12" />
      <View className="absolute rounded-full opacity-20 bg-yellow-500 w-36 h-36 bottom-24 -left-8" />
      <View className="absolute rounded-full opacity-20 bg-yellow-100 w-24 h-24" style={{ top: height * 0.3, right: 50 }} />

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ width: "100%", height:"100%", maxWidth: 800 }}>{children}</View>
      </View>
    </View>
  );
}

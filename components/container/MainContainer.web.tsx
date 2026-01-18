import { ReactNode } from "react";
import { StatusBar, useColorScheme, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
};

export function MainContainer({ children }: Props) {
  const colorScheme = useColorScheme();
  const barStyle = colorScheme === "dark" ? "light-content" : "dark-content";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FEFBED" }}>
      <StatusBar barStyle={barStyle} backgroundColor="#FEFBED" />

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ width: "100%", height: "100%", maxWidth: 800 }}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

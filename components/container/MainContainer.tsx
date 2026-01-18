import { ReactNode } from "react";
import { StatusBar, useColorScheme } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
};

export function MainContainer({ children }: Props) {
  const colorScheme = useColorScheme();
  const barStyle = colorScheme === "dark" ? "light-content" : "dark-content";

  return (
    <>
      <SafeAreaView edges={["top", "left", "right"]} style={[{ flex: 1, backgroundColor: "#FEFBED" }]}>
        <StatusBar barStyle={barStyle} backgroundColor="#FEFBED" />
        {children}
      </SafeAreaView>
    </>
  );
}

import { Box } from "@/components/ui/box";
import { BlurView } from "expo-blur";
import { ReactNode } from "react";
import { useColorScheme, View } from "react-native";

type Props = {
  children: ReactNode;
};

export function RoundedShadowBox({ children }: Props) {
  const colorScheme = useColorScheme();

  return (
    <Box className="rounded-3xl shadow-2xl mb-8 bg-gray-50 dark:bg-gray-800 android:elevation-10">
      <Box className="rounded-3xl overflow-hidden">
        <BlurView intensity={15} tint={colorScheme === "dark" ? "dark" : "light"}>
          <View className="p-8 bg-gray-50 dark:bg-gray-800">{children}</View>
        </BlurView>
      </Box>
    </Box>
  );
}

import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

type Props = {
  title: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  items: string[];
};

export function ItemListBox({ title, items, iconName="checkmark" }: Props) {
  return (
    <View className="p-5 bg-gray-100 dark:bg-gray-700 rounded-lg border border-yellow-400">
      <Text className="text-base font-bold dark:text-white text-gray-900 mb-4 text-center">{title}</Text>
      <View className="space-y-3">
        {items.map((item, i) => (
          <View key={i} className="flex-row items-center">
            <View className="w-6 h-6 rounded-full bg-yellow-400 items-center justify-center mr-3 mb-1">
              <Ionicons name={iconName} size={16} color="#000" />
            </View>
            <Text className="text-sm font-semibold dark:text-white text-gray-900 opacity-80">{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

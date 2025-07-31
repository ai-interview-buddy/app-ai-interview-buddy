import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, View } from "react-native";

interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchBar: React.FC<Props> = ({ searchQuery, setSearchQuery }) => {
  return (
    <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 2,
          marginBottom: 10,
        }}
      >
        <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
        <TextInput
          placeholder="Search positions or companies..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            flex: 1,
            fontSize: 16,
            color: "#1D252C",
            paddingVertical: 16,
          }}
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );
};

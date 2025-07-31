import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export type JobPositionFilterType = "all" | "offers" | "archived";

interface Props {
  allCount?: number ;
  offersCount?: number ;
  archivedCount?: number ;
  selectedFilter: JobPositionFilterType;
  onSelect: (key: JobPositionFilterType) => void;
}

export const JobPositionFilterTabs: React.FC<Props> = ({ allCount, offersCount, archivedCount, selectedFilter, onSelect }) => {
  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#F8F9FA",
          borderRadius: 12,
          padding: 4,
        }}
      >
        {[
          { key: "all", label: `All (${allCount})` },
          { key: "offers", label: `Offers (${offersCount})` },
          { key: "archived", label: `Archived (${archivedCount})` },
        ].map((filter, index) => (
          <TouchableOpacity
            key={filter.key}
            onPress={() => onSelect(filter.key as JobPositionFilterType)}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              backgroundColor: selectedFilter === filter.key ? "#FFC629" : "transparent",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: selectedFilter === filter.key ? "#1D252C" : "#6B7280",
              }}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

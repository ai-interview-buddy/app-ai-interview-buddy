import { TimelineItemList } from "@/components/timeline-item/list/TimelineItemList";
import { useTimelineItems } from "@/lib/api/timelineItem.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { JobPosition } from "@/supabase/functions/api/types/JobPosition";
import { Ionicons } from "@expo/vector-icons";
import { default as React } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  record?: JobPosition;
}

export const JobDescriptionInterviewTimeline = ({ record }: Props) => {
  const { user } = useAuthStore();
  const { data, isLoading } = useTimelineItems(user?.accessToken, { unpaged: true, jobPositionId: record?.id });

  const loading = isLoading || !data;

  return (
    <View style={{ marginHorizontal: 20, marginBottom: 40 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: "#1D252C",
          marginBottom: 20,
        }}
      >
        Interview Timeline
      </Text>

      <View style={{ position: "relative" }}>
        {/* Timeline Line */}
        <View
          style={{
            position: "absolute",
            left: 24,
            top: 24,
            bottom: 0,
            width: 2,
            backgroundColor: "#E5E7EB",
          }}
        />

        {!loading &&
          data.map((timelineItem) => (
            <View key={timelineItem.id} style={{ marginBottom: 24 }}>
              <TimelineItemList timelineItem={timelineItem} />
            </View>
          ))}

        {/* Add New Stage Button */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            // onPress={handleCreateNewStage}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "#FFC629",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 16,
              shadowColor: "#FFC629",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="add" size={24} color="#1D252C" />
          </TouchableOpacity>

          <TouchableOpacity
            // onPress={handleCreateNewStage}
            style={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: 16,
              padding: 20,
              borderWidth: 2,
              borderColor: "#FFC629",
              borderStyle: "dashed",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#E3AA1F",
                textAlign: "center",
              }}
            >
              Add New Interview Stage
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

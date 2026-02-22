import { JobPosition } from "@/supabase/functions/api/types/JobPosition";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { JobPositionCompanyAvatar } from "../JobPositionCompanyAvatar";

interface Props {
  record?: JobPosition;
}

export const JobDescriptionHeader = ({ record }: Props) => {
  if (!record) return null;
  return (
    <>
      <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 20 }}>
        <JobPositionCompanyAvatar record={record} size="lg" />

        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: "#1D252C",
                flex: 1,
                marginRight: 8,
              }}
              numberOfLines={2}
            >
              {record?.jobTitle}
            </Text>

            {(record?.processingStatus === "PENDING" || record?.processingStatus === "PROCESSING") && (
              <View
                style={{
                  backgroundColor: "#FFF7DE",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <ActivityIndicator size="small" color="#E3AA1F" />
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    color: "#92400E",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  AI Enriching
                </Text>
              </View>
            )}

            {record?.offerReceived && (
              <View
                style={{
                  backgroundColor: "#FFC629",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: "#1D252C",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  OFFER
                </Text>
              </View>
            )}
          </View>

          <Text
            style={{
              fontSize: 16,
              color: "#6B7280",
              marginBottom: 4,
              fontWeight: "600",
            }}
          >
            {record?.companyName}
          </Text>

          {record?.salaryRange && (
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: record?.expectedSalary ? "#6B7280" : "#F59E0B",
              }}
            >
              {record?.salaryRange}
            </Text>
          )}

          {record?.expectedSalary && (
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#10B981",
              }}
            >
              {record?.expectedSalary}
            </Text>
          )}
        </View>
      </View>
    </>
  );
};

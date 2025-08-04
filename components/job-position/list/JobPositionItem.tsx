import { JobPosition } from "@/supabase/functions/api/types/JobPosition";
import React, { forwardRef } from "react";
import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { JobPositionCompanyAvatar } from "../JobPositionCompanyAvatar";

type JobPositionItemProps = {
  item: JobPosition;
};

export const JobPositionItem = forwardRef<React.ComponentRef<typeof TouchableOpacity>, JobPositionItemProps & TouchableOpacityProps>(
  ({ item, ...touchableProps }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        {...touchableProps}
        style={[
          {
            marginHorizontal: 20,
            marginBottom: 16,
            backgroundColor: "white",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          },
          touchableProps.style,
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <JobPositionCompanyAvatar record={item} />

          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#1D252C",
                  flex: 1,
                  marginRight: 8,
                }}
                numberOfLines={1}
              >
                {item.jobTitle}
              </Text>

              {item.offerReceived && (
                <View
                  style={{
                    backgroundColor: "#FFC629",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
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
                fontSize: 14,
                color: "#6B7280",
                marginBottom: 8,
                fontWeight: "500",
              }}
            >
              {item.companyName}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: item.expectedSalary ? "#10B981" : "#F59E0B",
                }}
              >
                {item.expectedSalary ? item.expectedSalary : item.salaryRange}
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: "#D1D5DB",
                  fontWeight: "500",
                }}
              >
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

JobPositionItem.displayName = "JobPositionItem";

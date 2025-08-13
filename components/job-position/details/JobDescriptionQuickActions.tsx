import { LightHeader } from "@/components/headers/LightHeader";
import { JobPosition } from "@/supabase/functions/api/types/JobPosition";
import { Ionicons } from "@expo/vector-icons";
import { Href, Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  record?: JobPosition;
}

interface Action {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  getLink: (record: JobPosition) => Href;
}

const actions: Action[] = [
  {
    icon: "document-text",
    title: "Write me a cover letter",
    subtitle: "Generate a personalized cover letter",
    getLink: (record: JobPosition) => `/job-position/${record.id}/timeline-create-cover-letter`,
  },
  {
    icon: "logo-linkedin",
    title: "Write me a LinkedIn Intro msg",
    subtitle: "Craft a connection message",
    getLink: (record: JobPosition) => `/job-position/${record.id}/timeline-create-linkedin-intro`,
  },
  {
    icon: "bookmark-outline",
    title: "Add a note",
    subtitle: "Save information about the interview",
    getLink: (record: JobPosition) => `/job-position/${record.id}/timeline-create-note`,
  },
  {
    icon: "mail-outline",
    title: "Email Reply",
    subtitle: "Generate an answer in seconds",
    getLink: (record: JobPosition) => `/job-position/${record.id}/timeline-create-reply-email`,
  },
  {
    icon: "mic-outline",
    title: "Interview feedback",
    subtitle: "Capture your interview and get AI powered feedback",
    getLink: (record: JobPosition) => `/interview/create-interview-analyse-step1?jobPositionId=${record.id}`,
  },
];

export const JobDescriptionQuickActions = ({ record }: Props) => {
  if (!record) return null;

  return (
    <View style={{ marginHorizontal: 20, marginBottom: 32 }}>
      <LightHeader title="Quick Actions" />

      <View style={{ gap: 12 }}>
        {actions.map((action, index) => (
          <Link href={action.getLink(record)} key={index} push asChild>
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: "white",
                borderRadius: 16,
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.02,
                shadowRadius: 4,
                elevation: 1,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#FFF7DE",
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                }}
              >
                <Ionicons name={action.icon as any} size={20} color="#E3AA1F" />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#1D252C",
                    marginBottom: 2,
                  }}
                >
                  {action.title}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#9CA3AF",
                  }}
                >
                  {action.subtitle}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </View>
  );
};

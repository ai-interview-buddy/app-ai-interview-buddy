import { ButtonDefault } from "@/components/button/ButtonDefault";
import { ButtonMain } from "@/components/button/ButtonMain";
import { MainContainer } from "@/components/container/MainContainer";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { Text } from "@/components/ui/text";
import { useUiStore } from "@/lib/storage/uiStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";

const FeedbackPage: React.FC = () => {
  const router = useRouter();
  const { markAsOpened } = useUiStore();
  const reportBugUrl = "https://docs.aiinterviewbuddy.com/community/report-bug";
  const redditUrl = "https://www.reddit.com/r/AiInterviewBuddy/";

  useEffect(() => {
    markAsOpened("hasOpenedFeedback");
  }, []);

  const handleBack = () => router.push("/account");

  const handleOpenReddit = () => {
    Linking.openURL(redditUrl);
  };

  const handleOpenReportBug = () => {
    Linking.openURL(reportBugUrl);
  };

  return (
    <MainContainer>
      <TitleBackHeader pageTitle="Feedback or report a bug" handleBack={handleBack} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
          maxWidth: 800,
          width: "100%",
          alignSelf: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 24,
            marginTop: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 10,
            elevation: 3,
            overflow: "hidden",
            maxWidth: 600,
            width: "100%",
            alignSelf: "center",
          }}
        >
          <Image
            source={require("@/assets/images/report-a-bug.png")}
            style={{
              width: "100%",
              height: 300,
              backgroundColor: "#F8F9FA",
            }}
            contentFit="contain"
          />

          <View style={{ padding: 24 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "800",
                color: "#1D252C",
                marginBottom: 12,
              }}
            >
              We value your feedback
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: "#4B5563",
                marginBottom: 24,
              }}
            >
              Found a bug or have a suggestion? We'd love to hear from you! Your feedback helps us make AI Interview Buddy better for
              everyone.
            </Text>

            <View style={{ gap: 16 }}>
              <ButtonMain onPress={handleOpenReddit} label="Join our Reddit Community" icon="logo-reddit" flex={false} />

              <ButtonDefault onPress={handleOpenReportBug} label="How to report a bug" icon="document-text-outline" flex={false} />
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 32,
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: "#FFC629" + "15",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name="people-outline" size={16} color="#FFC629" />
            </View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151" }}>Community Driven</Text>
          </View>
          <Text style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center" }}>
            Join hundreds of other candidates sharing their experiences and helping us build the best interview preparation tool.
          </Text>
        </View>
      </ScrollView>
    </MainContainer>
  );
};

export default FeedbackPage;

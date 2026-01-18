import { ButtonMain } from "@/components/button/ButtonMain";
import { MainContainer } from "@/components/container/MainContainer";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { Text } from "@/components/ui/text";
import { useUiStore } from "@/lib/storage/uiStore";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

const WebVersionPage: React.FC = () => {
  const router = useRouter();
  const { markAsOpened } = useUiStore();
  const [copied, setCopied] = useState(false);
  const webAppUrl = "https://app.aiinterviewbuddy.com/";

  useEffect(() => {
    markAsOpened("hasOpenedWebVersion");
  }, []);

  const handleBack = () => router.push("/account");

  const handleCopy = async () => {
    await Clipboard.setStringAsync(webAppUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenBrowser = () => {
    Linking.openURL(webAppUrl);
  };

  return (
    <MainContainer>
      <TitleBackHeader pageTitle="Use the web version" handleBack={handleBack} />

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
            source={require("@/assets/images/web-version.png")}
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
              Take it to the big screen
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: "#4B5563",
                marginBottom: 20,
              }}
            >
              Did you know all the features you love are also available in your desktop browser?
              {"\n\n"}
              Practice and prepare for your interviews with the comfort of a full keyboard and a larger display. It's much easier to use the
              web browser for deep focus sessions.
            </Text>

            <View
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: 16,
                padding: 12,
                borderWidth: 1,
                borderColor: "#F3F4F6",
                marginBottom: 24,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#6B7280",
                  flex: 1,
                  marginRight: 12,
                }}
                numberOfLines={1}
              >
                {webAppUrl}
              </Text>

              <TouchableOpacity
                onPress={handleCopy}
                style={{
                  backgroundColor: copied ? "#10B981" : "#F3F4F6",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name={copied ? "checkmark-circle" : "copy-outline"}
                  size={16}
                  color={copied ? "white" : "#4B5563"}
                  style={{ marginRight: 6 }}
                />
                <Text style={{ fontSize: 12, fontWeight: "700", color: copied ? "white" : "#4B5563" }}>{copied ? "Copied" : "Copy"}</Text>
              </TouchableOpacity>
            </View>

            <ButtonMain onPress={handleOpenBrowser} label="Open in Browser" icon="open-outline" flex={false} />
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
              <Ionicons name="sync" size={16} color="#FFC629" />
            </View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151" }}>Sync Everywhere</Text>
          </View>
          <Text style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center" }}>
            Your career profile and interview history are always in sync across all devices.
          </Text>
        </View>
      </ScrollView>
    </MainContainer>
  );
};

export default WebVersionPage;

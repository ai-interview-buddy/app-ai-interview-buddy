"use client";

import { MainAction } from "@/components/button/MainAction";
import { MainContainer } from "@/components/container/MainContainer";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type React from "react";
import { ScrollView, View } from "react-native";

const AccountDeletedScreen: React.FC = () => {
  const router = useRouter();

  const handleReturnHome = async () => {
    router.push("/auth");
  };

  return (
    <MainContainer>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: "white",
            marginHorizontal: 20,
            borderRadius: 24,
            padding: 32,
            marginTop: 20,
            marginBottom: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          {/* Success checkmark icon */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#10B981",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center", // keep just the icon centered
              marginBottom: 24,
            }}
          >
            <Ionicons name="checkmark" size={40} color="white" />
          </View>

          {/* Main heading */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: "800",
              color: "#1D252C",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Account Deleted Successfully
          </Text>

          {/* Farewell message */}
          <View style={{ marginBottom: 32, paddingHorizontal: 8 }}>
            <Text
              style={{
                fontSize: 16,
                color: "#6B7280",
                textAlign: "center",
                lineHeight: 2,
              }}
            >
              Sorry to see you go.{"\n"}
              We wish you the best in finding your next position.{"\n"}
              All your data has been securely deleted.{"\n"}
              If you decide to return, you are always welcome to use AI Interview Buddy again.
            </Text>
          </View>

          <View style={{ width: "100%" }}>
            <MainAction onPress={handleReturnHome}>Return to Homepage</MainAction>
          </View>
        </View>
      </ScrollView>
    </MainContainer>
  );
};

export default AccountDeletedScreen;

import { ButtonDanger } from "@/components/button/ButtonDanger";
import { MainContainer } from "@/components/container/MainContainer";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import AlertPolyfill from "@/components/ui/alert-web/AlertPolyfill";
import { Text } from "@/components/ui/text";
import { deleteAccount } from "@/lib/api/account.fetch";
import { useAuthStore } from "@/lib/supabase/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";

const AccountDelete: React.FC = () => {
  const router = useRouter();
  const { user, logOut, resetOnboarding } = useAuthStore();
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleBack = () => router.push("/account");

  const handleDelete = async () => {
    AlertPolyfill("Delete Account", "Are you absolutely sure? This action cannot be undone.", [
      { text: "Cancel", style: "cancel", onPress: () => {} },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setDeleting(true);
            await resetOnboarding();
            await deleteAccount(user?.accessToken!);
            await logOut();
            router.replace("/");
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to delete account. Please try again.");
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  return (
    <MainContainer>
      <TitleBackHeader pageTitle="Delete Account" handleBack={handleBack} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: 24,
            marginTop: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#B91C1C",
              marginBottom: 12,
            }}
          >
            Danger Zone
          </Text>

          <Text style={{ fontSize: 16, color: "#374151", marginBottom: 20 }}>
            Deleting your account is permanent and cannot be undone.{"\n\n"}
            All of your interviews, job applications, CVs, and other data will be permanently removed.
          </Text>

          {/* Confirm checkbox */}
          <TouchableOpacity
            onPress={() => setConfirmChecked(!confirmChecked)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <Ionicons
              name={confirmChecked ? "checkbox" : "square-outline"}
              size={24}
              color={confirmChecked ? "#B91C1C" : "#9CA3AF"}
              style={{ marginRight: 12 }}
            />
            <Text style={{ fontSize: 16, color: "#374151" }}>I understand this action cannot be undone</Text>
          </TouchableOpacity>

          {/* Delete button */}
          <ButtonDanger label="Delete My Account" icon="trash-outline" onPress={handleDelete} disabled={!confirmChecked || deleting} />
        </View>
      </ScrollView>
    </MainContainer>
  );
};

export default AccountDelete;

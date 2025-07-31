import { ButtonDefault } from "@/components/button/ButtonDefault";
import { ButtonMain } from "@/components/button/ButtonMain";
import { ProfileAnalysisList } from "@/components/career-profile/details/ProfileAnalysisList";
import { MainContainer } from "@/components/container/MainContainer";
import { RenameDialog } from "@/components/dialogs/RenameDialog";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { ScoreCircle } from "@/components/misc/ScoreCircle";
import AlertPolyfill from "@/components/ui/alert-web/AlertPolyfill";
import { PageLoading } from "@/components/views/PageLoading";
import { fetchSignedDownloadUrl } from "@/lib/api/careerProfile.fetch";
import { useCareerProfile, useDeleteCareerProfile, useUpdateCareerProfile } from "@/lib/api/careerProfile.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useQueryClient } from "@tanstack/react-query";
import { documentDirectory, downloadAsync } from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import { isAvailableAsync, shareAsync } from "expo-sharing";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, Text, View } from "react-native";

const CareerProfileDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // from /career-profile/details/[id]
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { showActionSheetWithOptions } = useActionSheet();
  const [showRename, setShowRename] = useState(false);

  const { data: record, isLoading, error } = useCareerProfile(user?.accessToken, id as string);
  const { mutateAsync } = useUpdateCareerProfile(queryClient, user?.accessToken);
  const { mutateAsync: deleteMutateAsync } = useDeleteCareerProfile(queryClient, user?.accessToken);

  const handleRename = async (newValue: string) => {
    try {
      await mutateAsync({
        id: record?.id,
        data: { title: newValue },
      });
      setShowRename(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDownloadCV = async () => {
    try {
      const { signedUrl } = await fetchSignedDownloadUrl(user?.accessToken, id as string);

      if (Platform.OS === "web") {
        window.open(signedUrl, "_blank");
      } else {
        const fileName = `CV-${record?.title || "profile"}.pdf`;
        const fileUri = documentDirectory + fileName;
        const downloadRes = await downloadAsync(signedUrl, fileUri);

        if (!(await isAvailableAsync())) {
          Alert.alert("Error", "Sharing is not available on this device.");
          return;
        }

        await shareAsync(downloadRes.uri, {
          mimeType: "application/pdf",
          dialogTitle: "Download CV",
          UTI: "com.adobe.pdf",
        });
      }
    } catch {
      Alert.alert("Error", "Failed to download CV");
    }
  };

  const handleDelete = () => {
    AlertPolyfill("Delete Career Profile", "Are you sure?", [
      { text: "Cancel", style: "cancel", onPress: () => {} },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteMutateAsync(record?.id!);
          router.replace("/career-profile");
        },
      },
    ]);
  };

  const showActions = () => {
    const options = ["Rename", "Cancel", "Delete"];
    const cancelButtonIndex = 1;
    const destructiveButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex?: number) => {
        if (selectedIndex === undefined) return;
        switch (selectedIndex) {
          case 0:
            setShowRename(true);
            break;

          case destructiveButtonIndex:
            handleDelete();
            break;

          case cancelButtonIndex:
          // Canceled
        }
      }
    );
  };

  if (isLoading || !record) {
    return <PageLoading />;
  }

  if (error) {
    return (
      <MainContainer>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "#EF4444", fontWeight: "500" }}>Failed to load career profile.</Text>
        </View>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <TitleBackHeader pageTitle="Career Profile" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View
          style={{
            backgroundColor: "white",
            marginHorizontal: 20,
            borderRadius: 20,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <ScoreCircle score={record?.curriculumScore || 0} size={100} />

            <Text style={{ fontSize: 24, fontWeight: "800", color: "#1D252C", marginBottom: 4 }}>{record.title}</Text>
            <Text style={{ color: "#6B7280" }}>Overall Curriculum Score</Text>
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <ButtonMain label="Share" icon="share-outline" onPress={handleDownloadCV} />
            <ButtonDefault icon="ellipsis-horizontal" onPress={showActions} flex={false} />
          </View>
        </View>

        <ProfileAnalysisList items={record.curriculumAnalyse} />
      </ScrollView>

      <RenameDialog
        currentValue={record.title}
        visible={showRename}
        onCancel={() => setShowRename(false)}
        onConfirm={(newValue) => handleRename(newValue)}
      />
    </MainContainer>
  );
};

export default CareerProfileDetails;

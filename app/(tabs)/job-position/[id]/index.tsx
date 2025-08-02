import { ButtonDefault } from "@/components/button/ButtonDefault";
import { ButtonMainLink } from "@/components/button/ButtonMain";
import { MainContainer } from "@/components/container/MainContainer";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { JobDescriptionHeader } from "@/components/job-position/details/JobDescriptionHeader";
import { JobDescriptionQuickActions } from "@/components/job-position/details/JobDescriptionQuickActions";
import AlertPolyfill from "@/components/ui/alert-web/AlertPolyfill";
import { PageLoading } from "@/components/views/PageLoading";
import { useDeleteJobPosition, useJobPosition } from "@/lib/api/jobPosition.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";

const JobPositionDetails: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { showActionSheetWithOptions } = useActionSheet();

  const { data: record, isLoading, error } = useJobPosition(user?.accessToken, id as string);
  const { mutateAsync: deleteMutateAsync } = useDeleteJobPosition(queryClient, user?.accessToken);

  const showActions = () => {
    const options = ["Edit", "Cancel", "Delete"];
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
            router.push(`/job-position/${id}/update`);
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

  const handleDelete = () => {
    AlertPolyfill("Delete Career Profile", "Are you sure?", [
      { text: "Cancel", style: "cancel", onPress: () => {} },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteMutateAsync(record?.id!);
          router.replace("/job-position");
        },
      },
    ]);
  };

  if (isLoading || !record) {
    return <PageLoading />;
  }

  const handleBack = () => router.push("/job-position/");
  const handleCancel = () => router.push("/job-position/");

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainContainer>
        <TitleBackHeader pageTitle="Job Position" handleBack={handleBack} handleCancel={handleCancel} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <View
            style={{
              backgroundColor: "white",
              marginHorizontal: 20,
              borderRadius: 20,
              padding: 24,
              marginBottom: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <JobDescriptionHeader record={record} />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <ButtonMainLink label="View Position Details" icon="create-outline" href={`/job-position/${id}/job-description`} />
              <ButtonDefault icon="ellipsis-horizontal" onPress={showActions} flex={false} />
            </View>
          </View>

          <JobDescriptionQuickActions record={record} />
        </ScrollView>
      </MainContainer>
    </>
  );
};

export default JobPositionDetails;

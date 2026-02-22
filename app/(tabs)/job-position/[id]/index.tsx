import { ButtonDefault } from "@/components/button/ButtonDefault";
import { ButtonMain, ButtonMainLink } from "@/components/button/ButtonMain";
import { MainContainer } from "@/components/container/MainContainer";
import { LightHeader } from "@/components/headers/LightHeader";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { JobDescriptionHeader } from "@/components/job-position/details/JobDescriptionHeader";
import { JobDescriptionInterviewTimeline } from "@/components/job-position/details/JobDescriptionInterviewTimeline";
import { JobDescriptionQuickActions } from "@/components/job-position/details/JobDescriptionQuickActions";
import AlertPolyfill from "@/components/ui/alert-web/AlertPolyfill";
import { PageLoading } from "@/components/views/PageLoading";
import { useArchiveJobPosition, useDeleteJobPosition, useJobPosition, useMarkJobPositionOfferReceived } from "@/lib/api/jobPosition.query";
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

  const { data: record, isLoading, error } = useJobPosition(user?.accessToken, id as string, {
    refetchInterval: (query) => {
      const status = query.state.data?.processingStatus;
      return status === "PENDING" || status === "PROCESSING" ? 5000 : false;
    },
  });
  const { mutateAsync: archiveMutateAsync } = useArchiveJobPosition(queryClient, user?.accessToken);
  const { mutateAsync: offerMutateAsync } = useMarkJobPositionOfferReceived(queryClient, user?.accessToken);
  const { mutateAsync: deleteMutateAsync } = useDeleteJobPosition(queryClient, user?.accessToken);

  const archiveLabel = record?.archived ? "Unarchive" : "Archive";

  const showActions = () => {
    const options = ["Edit", archiveLabel, "Cancel", "Delete"];
    const cancelButtonIndex = 2;
    const destructiveButtonIndex = 3;

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

          case 1:
            handleArchive();
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

  const handleArchive = () => {
    AlertPolyfill(archiveLabel, "Are you sure?", [
      { text: "Cancel", style: "cancel", onPress: () => {} },
      {
        text: "Yes",
        style: record?.archived ? "default" : "destructive",
        onPress: () => {
          archiveMutateAsync([record?.id!]);
          router.replace("/job-position");
        },
      },
    ]);
  };

  const handleOfferRecieved = () => {
    AlertPolyfill("Offer received", "Are you sure?", [
      { text: "Cancel", style: "cancel", onPress: () => {} },
      {
        text: "Yes",
        onPress: () => {
          offerMutateAsync([record?.id!]);
          router.replace(`/job-position/${id}/offer-received`);
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
              <ButtonMainLink label="View Job Description" icon="briefcase-outline" href={`/job-position/${id}/job-description`} />
              <ButtonDefault icon="ellipsis-horizontal" onPress={showActions} flex={false} />
            </View>
          </View>

          <JobDescriptionQuickActions record={record} />

          <JobDescriptionInterviewTimeline record={record} />

          <View style={{ marginHorizontal: 20, marginBottom: 32 }}>
            <LightHeader title="Offer" />
            <ButtonMain icon="ribbon-outline" onPress={handleOfferRecieved} flex={false} label="Offer Received" />
          </View>
        </ScrollView>
      </MainContainer>
    </>
  );
};

export default JobPositionDetails;

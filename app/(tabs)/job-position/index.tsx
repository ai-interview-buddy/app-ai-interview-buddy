import { FloatingActionLink } from "@/components/button/FloatingActionLink";
import { MainContainer } from "@/components/container/MainContainer";
import { TitleListHeader } from "@/components/headers/TitleListHeader";
import { JobPositionFilterTabs, JobPositionFilterType } from "@/components/job-position/list/JobPositionFilterTabs";
import { JobPositionItem } from "@/components/job-position/list/JobPositionItem";
import { SearchBar } from "@/components/misc/SearchBar";
import { EmptyState } from "@/components/views/EmptyState";
import { PageLoading } from "@/components/views/PageLoading";
import { useJobPositions } from "@/lib/api/jobPosition.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { JobPosition } from "@/supabase/functions/api/types/JobPosition";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

const JobPositionList: React.FC = () => {
  const { user } = useAuthStore();
  const { data, isSuccess, isRefetching, isLoading, refetch } = useJobPositions(user?.accessToken);
  const isEmpty = isSuccess && data.length === 0;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<JobPositionFilterType>("all");

  // Filter counts
  const allCount = data?.filter((p) => !p.archived).length;
  const offersCount = data?.filter((p) => p.offerReceived).length;
  const archivedCount = data?.filter((p) => p.archived).length;

  if (isLoading) {
    return <PageLoading />;
  }

  const filterByState = {
    offers: (p: JobPosition) => p.offerReceived,
    archived: (p: JobPosition) => p.archived,
    all: (p: JobPosition) => !p.archived,
  }[selectedFilter];

  const filteredPositions = data?.filter((position) => {
    if (!filterByState(position)) return false;
    if (!searchQuery) return true;

    return (
      position.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      position.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <MainContainer>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["#FFC629"]} tintColor="#FFC629" />}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <TitleListHeader title="Job Positions" info="Track your applications and opportunities" />

          {isEmpty && (
            <EmptyState title="No Job Positions Yet" icon="briefcase-outline">
              Start tracking your job applications by adding your first position.
            </EmptyState>
          )}

          {!isEmpty && (
            <>
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              <JobPositionFilterTabs
                allCount={allCount}
                offersCount={offersCount}
                archivedCount={archivedCount}
                selectedFilter={selectedFilter}
                onSelect={setSelectedFilter}
              />
              <View>
                {filteredPositions?.map((item, index) => (
                  <JobPositionItem item={item} key={index} />
                ))}
              </View>
            </>
          )}
        </ScrollView>

        <FloatingActionLink href="/(tabs)/career-profile/create" />
      </MainContainer>
    </>
  );
};

export default JobPositionList;

import { FloatingActionLink } from "@/components/button/FloatingActionLink";
import { ProfileListItem } from "@/components/career-profile/list/ProfileListItem";
import { MainContainer } from "@/components/container/MainContainer";
import { TitleListHeader } from "@/components/headers/TitleListHeader";
import { EmptyState } from "@/components/views/EmptyState";
import { PageLoading } from "@/components/views/PageLoading";
import { useCareerProfiles } from "@/lib/api/careerProfile.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";

const CareerProfileList: React.FC = () => {
  const { user } = useAuthStore();
  const { data, isSuccess, isRefetching, isLoading, refetch } = useCareerProfiles(user?.accessToken);
  const isEmpty = isSuccess && data.length === 0;

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <MainContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} colors={["#FFC629"]} tintColor="#FFC629" />}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <TitleListHeader title="Career Profiles" info="Analyze and improve your curriculum for different roles" />

        {isEmpty && (
          <EmptyState title="No Career Profiles Yet">
            Create your first career profile to get personalized curriculum analysis and recommendations.
          </EmptyState>
        )}

        {!isEmpty && (
          <View>
            {data?.map((item, index) => (
              <ProfileListItem item={item} key={index} />
            ))}
          </View>
        )}
      </ScrollView>

      <FloatingActionLink href="/(tabs)/career-profile/create" />
    </MainContainer>
  );
};

export default CareerProfileList;

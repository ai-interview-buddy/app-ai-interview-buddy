import { MainContainer } from "@/components/container/MainContainer";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Types
type JobPosition = {
  id: string;
  createdDate: string;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  jobTitle: string;
  jobDescription: string;
  salaryRange?: string;
  expectedSalary?: string;
  fileList: any[];
  offerReceived: boolean;
};

// Mock data transformer
const transformPostToJobPosition = (post: any): JobPosition => ({
  id: post.id.toString(),
  createdDate: new Date().toISOString(),
  companyName: `Company ${post.userId}`,
  companyLogo: `https://ui-avatars.com/api/?name=Company+${post.userId}&background=f3f4f6&color=6b7280&size=40`,
  companyWebsite: `https://company${post.userId}.com`,
  jobTitle: post.title.charAt(0).toUpperCase() + post.title.slice(1),
  jobDescription: post.body,
  salaryRange: `$${50000 + post.id * 5000}-${80000 + post.id * 5000}`,
  expectedSalary: `$${60000 + post.id * 5000}`,
  fileList: [],
  offerReceived: Math.random() > 0.7,
});

const { width } = Dimensions.get("window");

const JobPositionList: React.FC = () => {
  const { colorScheme } = useColorScheme();
  const barStyle = colorScheme === "dark" ? "light-content" : "dark-content";

  // State
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [filteredPositions, setFilteredPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "offers" | "pending">("all");

  // Fetch data
  const fetchJobPositions = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      const posts = await response.json();
      const transformedData = posts.slice(0, 10).map(transformPostToJobPosition);
      setJobPositions(transformedData);
      setFilteredPositions(transformedData);
    } catch (error) {
      console.error("Error fetching job positions:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobPositions();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = jobPositions;

    if (searchQuery) {
      filtered = filtered.filter(
        (position) =>
          position.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          position.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFilter === "offers") {
      filtered = filtered.filter((position) => position.offerReceived);
    } else if (selectedFilter === "pending") {
      filtered = filtered.filter((position) => !position.offerReceived);
    }

    setFilteredPositions(filtered);
  }, [searchQuery, selectedFilter, jobPositions]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobPositions();
  };

  const handleAddNewPosition = () => {
    console.log("Add new position");
  };

  // Filter counts
  const allCount = jobPositions.length;
  const offersCount = jobPositions.filter((p) => p.offerReceived).length;
  const pendingCount = jobPositions.filter((p) => !p.offerReceived).length;

  // Render filter tabs
  const renderFilterTabs = () => (
    <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#F8F9FA",
          borderRadius: 12,
          padding: 4,
        }}
      >
        {[
          { key: "all", label: `All (${allCount})` },
          { key: "offers", label: `Offers (${offersCount})` },
          { key: "pending", label: `Pending (${pendingCount})` },
        ].map((filter, index) => (
          <TouchableOpacity
            key={filter.key}
            onPress={() => setSelectedFilter(filter.key as any)}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              backgroundColor: selectedFilter === filter.key ? "#FFC629" : "transparent",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: selectedFilter === filter.key ? "#1D252C" : "#6B7280",
              }}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Render job position item
  const renderJobPosition = (item: JobPosition, index: number) => (
    <Link href="/(tabs)/job-position/details" key={item.id} push asChild>
      <TouchableOpacity
        style={{
          marginHorizontal: 20,
          marginBottom: 16,
          backgroundColor: "white",
          borderRadius: 16,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <Image
            source={{ uri: item.companyLogo }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: "#F3F4F6",
              marginRight: 16,
            }}
          />

          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#1D252C",
                  flex: 1,
                  marginRight: 8,
                }}
                numberOfLines={1}
              >
                {item.jobTitle}
              </Text>

              {item.offerReceived && (
                <View
                  style={{
                    backgroundColor: "#FFC629",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: "#1D252C",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    OFFER
                  </Text>
                </View>
              )}
            </View>

            <Text
              style={{
                fontSize: 14,
                color: "#6B7280",
                marginBottom: 8,
                fontWeight: "500",
              }}
            >
              {item.companyName}
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: "#9CA3AF",
                lineHeight: 20,
                marginBottom: 16,
              }}
              numberOfLines={2}
            >
              {item.jobDescription}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#F59E0B",
                }}
              >
                {item.salaryRange}
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: "#D1D5DB",
                  fontWeight: "500",
                }}
              >
                {new Date(item.createdDate).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
        minHeight: 400,
      }}
    >
      <View
        style={{
          width: 120,
          height: 120,
          backgroundColor: "#FFF7DE",
          borderRadius: 60,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <Ionicons name="briefcase-outline" size={48} color="#E3AA1F" />
      </View>

      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          color: "#1D252C",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        No Job Positions Yet
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: "#6B7280",
          textAlign: "center",
          lineHeight: 24,
          marginBottom: 32,
        }}
      >
        Start tracking your job applications by adding your first position.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FEFBED" }}>
        <StatusBar barStyle={barStyle} backgroundColor="#FEFBED" />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#FFC629" />
          <Text
            style={{
              marginTop: 16,
              fontSize: 16,
              color: "#6B7280",
              fontWeight: "500",
            }}
          >
            Loading positions...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <MainContainer>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FFC629"]} tintColor="#FFC629" />}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Header */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: "800",
                color: "#1D252C",
                marginBottom: 8,
              }}
            >
              Job Positions
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: "#6B7280",
                marginBottom: 24,
                fontWeight: "500",
              }}
            >
              Track your applications and opportunities
            </Text>

            {/* Search Bar */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
              <TextInput
                placeholder="Search positions or companies..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: "#1D252C",
                  paddingVertical: 16,
                }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Filter Tabs */}
          {jobPositions.length > 0 && renderFilterTabs()}

          {/* Job List or Empty State */}
          {filteredPositions.length === 0 && !loading ? (
            renderEmptyState()
          ) : (
            <View>{filteredPositions.map((item, index) => renderJobPosition(item, index))}</View>
          )}
        </ScrollView>

        {/* Fixed Floating Action Button */}
        <TouchableOpacity
          onPress={handleAddNewPosition}
          style={{
            position: "absolute",
            bottom: 30,
            right: 20,
            width: 56,
            height: 56,
            backgroundColor: "#FFC629",
            borderRadius: 28,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Ionicons name="add" size={32} color="#1D252C" />
        </TouchableOpacity>
      </MainContainer>
    </>
  );
};

export default JobPositionList;

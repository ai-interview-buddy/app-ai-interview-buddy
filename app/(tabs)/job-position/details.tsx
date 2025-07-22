import { MainContainer } from "@/components/container/MainContainer";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { Alert, Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";

// Types
type FeedbackStatus = "NEW" | "UPLOADING" | "PROCESSING" | "ANALYSING" | "FAILED" | "FINISHED";

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

type InterviewStage = {
  id: string;
  description: string;
  position: JobPosition;
  instructions?: string;
  scheduledDate?: string;
  interviewerName?: string;
  fileList: any[];
  isMockInterview: boolean;
  status: FeedbackStatus;
  score?: number;
};

const JobPositionDetails: React.FC = () => {
  const { colorScheme } = useColorScheme();
  const barStyle = colorScheme === "dark" ? "light-content" : "dark-content";
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // State
  const [jobPosition, setJobPosition] = useState<JobPosition | null>(null);
  const [interviewStages, setInterviewStages] = useState<InterviewStage[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchJobPosition = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockJobPosition: JobPosition = {
          id: (id as string) || "1",
          createdDate: new Date().toISOString(),
          companyName: "TechCorp Inc.",
          companyLogo: "https://ui-avatars.com/api/?name=TechCorp+Inc&background=f3f4f6&color=6b7280&size=80",
          companyWebsite: "https://techcorp.com",
          jobTitle: "Senior Frontend Developer",
          jobDescription:
            "We are looking for a passionate Senior Frontend Developer to join our growing team. You will be responsible for building user-facing features using React, TypeScript, and modern web technologies.",
          salaryRange: "$90,000-120,000",
          expectedSalary: "$105,000",
          fileList: [],
          offerReceived: false,
        };

        const mockStages: InterviewStage[] = [
          {
            id: "1",
            description: "Recruiter Screening",
            position: mockJobPosition,
            instructions: "Initial phone screening with HR to discuss background and role fit.",
            scheduledDate: "2024-01-15T10:00:00Z",
            interviewerName: "Sarah Johnson",
            fileList: [],
            isMockInterview: false,
            status: "FINISHED",
            score: 85,
          },
          {
            id: "2",
            description: "Technical Interview",
            position: mockJobPosition,
            instructions: "Live coding session focusing on React and JavaScript fundamentals.",
            scheduledDate: "2024-01-20T14:00:00Z",
            interviewerName: "Mike Chen",
            fileList: [],
            isMockInterview: false,
            status: "PROCESSING",
          },
          {
            id: "3",
            description: "Final Round",
            position: mockJobPosition,
            instructions: "Meet with the team lead and discuss project experience.",
            fileList: [],
            isMockInterview: false,
            status: "NEW",
          },
        ];

        setJobPosition(mockJobPosition);
        setInterviewStages(mockStages);
      } catch (error) {
        console.error("Error fetching job position:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobPosition();
  }, [id]);

  const handleQuickAction = (action: string) => {
    Alert.alert("Coming Soon", `${action} functionality will be implemented soon!`);
  };

  const handleCreateNewStage = () => {
    Alert.alert("Coming Soon", "Create new interview stage functionality will be implemented soon!");
  };

  const getStatusColor = (status: FeedbackStatus) => {
    switch (status) {
      case "FINISHED":
        return "#10B981";
      case "PROCESSING":
        return "#F59E0B";
      case "ANALYSING":
        return "#8B5CF6";
      case "UPLOADING":
        return "#3B82F6";
      case "FAILED":
        return "#EF4444";
      default:
        return "#9CA3AF";
    }
  };

  const getStatusText = (status: FeedbackStatus) => {
    switch (status) {
      case "NEW":
        return "Scheduled";
      case "UPLOADING":
        return "Uploading";
      case "PROCESSING":
        return "Processing";
      case "ANALYSING":
        return "Analysing";
      case "FAILED":
        return "Failed";
      case "FINISHED":
        return "Completed";
      default:
        return status;
    }
  };

  const renderHeader = () => (
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
      <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 20 }}>
        <Image
          source={{ uri: jobPosition?.companyLogo }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
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
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: "#1D252C",
                flex: 1,
                marginRight: 8,
              }}
              numberOfLines={2}
            >
              {jobPosition?.jobTitle}
            </Text>

            {jobPosition?.offerReceived && (
              <View
                style={{
                  backgroundColor: "#FFC629",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
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
              fontSize: 16,
              color: "#6B7280",
              marginBottom: 4,
              fontWeight: "600",
            }}
          >
            {jobPosition?.companyName}
          </Text>

          {jobPosition?.salaryRange && (
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#F59E0B",
              }}
            >
              {jobPosition.salaryRange}
            </Text>
          )}
        </View>
      </View>

      <Text
        style={{
          fontSize: 14,
          color: "#6B7280",
          lineHeight: 20,
          marginBottom: 20,
        }}
        numberOfLines={3}
      >
        {jobPosition?.jobDescription}
      </Text>

      <Link href="/(tabs)/job-position/update" push asChild>
        <TouchableOpacity
          onPress={() => handleQuickAction("Update Position")}
          style={{
            backgroundColor: "#F8F9FA",
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="create-outline" size={20} color="#6B7280" style={{ marginRight: 8 }} />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#6B7280",
            }}
          >
            Update Position Details
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );

  const renderQuickActions = () => (
    <View style={{ marginHorizontal: 20, marginBottom: 32 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: "#1D252C",
          marginBottom: 16,
        }}
      >
        Quick Actions
      </Text>

      <View style={{ gap: 12 }}>
        {[
          { icon: "document-text", title: "Write me a cover letter", subtitle: "Generate a personalized cover letter" },
          { icon: "logo-linkedin", title: "Write me a LinkedIn Intro msg", subtitle: "Craft a connection message" },
          { icon: "help-circle", title: "Answer a question", subtitle: "Practice interview questions" },
        ].map((action, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleQuickAction(action.title)}
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.02,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: "#FFF7DE",
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
              }}
            >
              <Ionicons name={action.icon as any} size={20} color="#E3AA1F" />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#1D252C",
                  marginBottom: 2,
                }}
              >
                {action.title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#9CA3AF",
                }}
              >
                {action.subtitle}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderInterviewTimeline = () => (
    <View style={{ marginHorizontal: 20, marginBottom: 40 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: "#1D252C",
          marginBottom: 20,
        }}
      >
        Interview Stages
      </Text>

      <View style={{ position: "relative" }}>
        {/* Timeline Line */}
        <View
          style={{
            position: "absolute",
            left: 24,
            top: 24,
            bottom: 0,
            width: 2,
            backgroundColor: "#E5E7EB",
          }}
        />

        {interviewStages.map((stage, index) => (
          <View key={stage.id} style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              {/* Timeline Dot */}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: getStatusColor(stage.status),
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                  zIndex: 1,
                }}
              >
                {stage.status === "FINISHED" ? (
                  <Ionicons name="checkmark" size={24} color="white" />
                ) : stage.status === "PROCESSING" || stage.status === "ANALYSING" ? (
                  <Ionicons name="time" size={20} color="white" />
                ) : stage.status === "FAILED" ? (
                  <Ionicons name="close" size={24} color="white" />
                ) : (
                  <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>{index + 1}</Text>
                )}
              </View>

              {/* Stage Content */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  borderRadius: 16,
                  padding: 20,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.02,
                  shadowRadius: 4,
                  elevation: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#1D252C",
                      flex: 1,
                    }}
                  >
                    {stage.description}
                  </Text>

                  <View
                    style={{
                      backgroundColor: getStatusColor(stage.status) + "20",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "600",
                        color: getStatusColor(stage.status),
                        textTransform: "uppercase",
                      }}
                    >
                      {getStatusText(stage.status)}
                    </Text>
                  </View>
                </View>

                {stage.instructions && (
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#6B7280",
                      lineHeight: 20,
                      marginBottom: 12,
                    }}
                  >
                    {stage.instructions}
                  </Text>
                )}

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View>
                    {stage.interviewerName && (
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: "#1D252C",
                        }}
                      >
                        {stage.interviewerName}
                      </Text>
                    )}
                    {stage.scheduledDate && (
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#9CA3AF",
                        }}
                      >
                        {new Date(stage.scheduledDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    )}
                  </View>

                  {stage.score && (
                    <View
                      style={{
                        backgroundColor: "#FFF7DE",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color: "#E3AA1F",
                        }}
                      >
                        {stage.score}/100
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Add New Stage Button */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleCreateNewStage}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "#FFC629",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 16,
              shadowColor: "#FFC629",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="add" size={24} color="#1D252C" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCreateNewStage}
            style={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: 16,
              padding: 20,
              borderWidth: 2,
              borderColor: "#FFC629",
              borderStyle: "dashed",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#E3AA1F",
                textAlign: "center",
              }}
            >
              Add New Interview Stage
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading || !jobPosition) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FEFBED" }}>
        <StatusBar barStyle={barStyle} backgroundColor="#FEFBED" />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "#6B7280", fontWeight: "500" }}>Loading position details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainContainer>
        {/* Navigation Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 24,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#1D252C" />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1D252C",
            }}
          >
            Position Details
          </Text>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {renderHeader()}
          {renderQuickActions()}
          {renderInterviewTimeline()}
        </ScrollView>
      </MainContainer>
    </>
  );
};

export default JobPositionDetails;

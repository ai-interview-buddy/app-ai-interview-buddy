import { CollapsibleCard } from "@/components/container/CollapsibleCard";
import { FormFieldTextArea } from "@/components/data-input/FormFieldTextArea";
import { SelectCareerProfile } from "@/components/data-input/SelectCareerProfile";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "@tanstack/react-form";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { z } from "zod";
import { MainAction } from "../button/MainAction";

const formSchema = z.object({
  profileId: z.string().optional(),
  jobDescription: z.string().optional(),
  customInstructions: z.string().optional(),
});

export type InterviewPreparationFormValues = z.infer<typeof formSchema>;

interface InterviewPreparationViewProps {
  onStartInterview: (values: InterviewPreparationFormValues) => void;
  positionId?: string;
}

export const InterviewPreparationView: React.FC<InterviewPreparationViewProps> = ({ onStartInterview, positionId }) => {
  const form = useForm({
    defaultValues: {
      profileId: "",
      jobDescription: "",
      customInstructions: "",
    } as InterviewPreparationFormValues,
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      onStartInterview(value);
    },
  });

  return (
    <>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, marginTop: 20 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#1D252C",
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Ready to Practice?
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
            Your AI interviewer is ready to help you prepare. Get personalized feedback on your responses.
          </Text>

          {/* Job Description Card */}
          {!positionId && (
            <CollapsibleCard icon="briefcase-outline" title="Job Description">
              <SelectCareerProfile name="profileId" label="Career Profile" form={form} formSchema={formSchema} />
              <FormFieldTextArea
                form={form}
                formSchema={formSchema}
                name="jobDescription"
                label="Job Description"
                helper="Paste the complete job description here"
                placeholder="This is optional, if empty we will use your Career Profile"
              />
            </CollapsibleCard>
          )}

          {/* Custom Instructions Card */}
          <CollapsibleCard icon="create-outline" title="Custom Instructions">
            <FormFieldTextArea
              form={form}
              formSchema={formSchema}
              name="customInstructions"
              label="Add specific topics or areas you'd like to focus on"
              placeholder="E.g., Focus on leadership examples, technical problem-solving..."
            />
          </CollapsibleCard>

          {/* Interview Details */}
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 20,
              marginBottom: 32,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#1D252C",
                marginBottom: 16,
              }}
            >
              What to Expect
            </Text>

            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "#FFF7DE",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="time-outline" size={18} color="#FFC629" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#1D252C", marginBottom: 2 }}>Approximately 25 minutes</Text>
                  <Text style={{ fontSize: 13, color: "#6B7280" }}>Average interview duration</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "#FFF7DE",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="chatbubbles-outline" size={18} color="#FFC629" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#1D252C", marginBottom: 2 }}>Questions and follow-ups</Text>
                  <Text style={{ fontSize: 13, color: "#6B7280" }}>Tailored to your role, job description, and custom instructions</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "#FFF7DE",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="analytics-outline" size={18} color="#FFC629" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#1D252C", marginBottom: 2 }}>Instant feedback</Text>
                  <Text style={{ fontSize: 13, color: "#6B7280" }}>Get AI-powered insights on your answers</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 5,
          paddingBottom: 10,
          backgroundColor: "#FEFBED",
          borderRadius: 12,
        }}
      >
        <MainAction isLoading={false} onPress={form.handleSubmit} loadingText="Saving...">
          Start Mock Interview
        </MainAction>
      </View>
    </>
  );
};

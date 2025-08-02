import { MainContainer } from "@/components/container/MainContainer";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { PageLoading } from "@/components/views/PageLoading";
import { useJobPosition } from "@/lib/api/jobPosition.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Markdown from "react-native-markdown-display";

interface ITextNode {
  key: string;
  content: string;
}

interface IStylesNode {
  text: object;
  textgroup: object;
}

const rules = {
  text: (node: ITextNode, children: unknown, parent: unknown, styles: IStylesNode, inheritedStyles = {}) => (
    <Text key={node.key} style={[inheritedStyles, styles.text]} selectable>
      {node.content}
    </Text>
  ),
  textgroup: (node: ITextNode, children: any, parent: unknown, styles: IStylesNode) => (
    <Text key={node.key} style={styles.textgroup} selectable>
      {children}
    </Text>
  ),
};

export default function JobDescription() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuthStore();

  const { data: record, isLoading, error } = useJobPosition(user?.accessToken, id as string);

  if (isLoading || !record) {
    return <PageLoading />;
  }

  const handleBack = () => router.push(`/job-position/${id}`);
  const handleCancel = () => router.push("/job-position");

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainContainer>
        <TitleBackHeader pageTitle="Job Description" handleBack={handleBack} handleCancel={handleCancel} />

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{ height: "100%" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
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
            <Markdown rules={rules} style={markdownStyles}>
              {record.jobDescription}
            </Markdown>
          </View>
        </ScrollView>
      </MainContainer>
    </>
  );
}

const markdownStyles = StyleSheet.create({
  // Body text
  text: {
    color: "#1D252C", // match your primary text
    fontSize: 16,
    lineHeight: 24,
  },

  // Headings (GitHub-like weights & spacing)
  heading1: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1D252C",
    marginVertical: 12,
  },
  heading2: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1D252C",
    marginVertical: 10,
  },
  heading3: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D252C",
    marginVertical: 8,
  },
  heading4: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D252C",
    marginVertical: 6,
  },
  heading5: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D252C",
    marginVertical: 4,
  },
  heading6: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D252C",
    marginVertical: 4,
  },

  // Strong / emphasis
  strong: { fontWeight: "700" },
  em: { fontStyle: "italic" },

  // Paragraph & breaks
  paragraph: { marginVertical: 6 },
  hardbreak: { height: 6 },

  // Lists
  list: { marginVertical: 6 },
  listUnordered: { marginLeft: 20 },
  listOrdered: { marginLeft: 20 },
  listUnorderedItemIcon: { marginRight: 6 },
  listOrderedItemIcon: { marginRight: 6 },
  listItem: { flexDirection: "row", alignItems: "flex-start" },
  listUnorderedItemText: { flex: 1 },
  listOrderedItemText: { flex: 1 },

  // Blockquote (light grey bar on left)
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: "#E5E7EB",
    paddingLeft: 12,
    marginVertical: 8,
    color: "#6B7280",
  },

  // Code blocks & inline code
  code_block: {
    backgroundColor: "#F8F9FA",
    borderRadius: 4,
    padding: 12,
    fontFamily: "Courier",
    marginVertical: 12,
  },
  inlineCode: {
    backgroundColor: "#F8F9FA",
    borderRadius: 4,
    paddingHorizontal: 4,
    fontFamily: "Courier",
  },

  // Horizontal rule
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: "#E1E4E8",
    marginVertical: 16,
  },

  // Links
  link: {
    color: "#0366D6",
    textDecorationLine: "underline",
  },

  // Tables (GitHub-style grid)
  table: {
    borderWidth: 1,
    borderColor: "#E1E4E8",
    borderRadius: 4,
    marginVertical: 8,
  },
  tableHeader: {
    backgroundColor: "#F6F8FA",
  },
  tableHeaderCell: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#E1E4E8",
  },
  tableRow: {
    borderBottomWidth: 1,
    borderColor: "#E1E4E8",
  },
  tableRowCell: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#E1E4E8",
  },

  // Images
  image: {
    maxWidth: "100%",
    resizeMode: "contain",
    marginVertical: 8,
  },
});

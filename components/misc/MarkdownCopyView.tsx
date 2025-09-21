import { ButtonMain } from "@/components/button/ButtonMain";
import * as Clipboard from "expo-clipboard";
import React, { ReactNode, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Markdown, { MarkdownIt } from "react-native-markdown-display";
import { EmptyState } from "../views/EmptyState";

interface Props {
  markdownText?: string;
  children?: ReactNode;
  before?: ReactNode;
}

export const MarkdownCopyView = ({ markdownText, children, before }: Props) => {
  const originalLabel = "Copy to clipboard";
  const [label, setLabel] = useState(originalLabel);

  const copyToClipboard = async () => {
    const markdownItInstance = MarkdownIt({ typographer: true, html: true });
    const rendered = markdownItInstance.render(markdownText);
    await Clipboard.setStringAsync(rendered, { inputFormat: Clipboard.StringFormat.HTML });
    setLabel("Copied");

    setTimeout(() => setLabel(originalLabel), 2000);
  };

  if (!markdownText) {
    return <EmptyState title="Empty item">Looks empty here.</EmptyState>;
  }

  return (
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
          marginBottom: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <ButtonMain
          label={label}
          icon={label == originalLabel ? "clipboard-outline" : "checkmark-circle-outline"}
          onPress={copyToClipboard}
        />
      </View>

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
        {before && <View style={{ marginBottom: 20 }}>{before}</View>}

        <Markdown rules={rules} style={markdownStyles}>
          {markdownText}
        </Markdown>

        {children && <View style={{ marginTop: 20 }}>{children}</View>}
      </View>
    </ScrollView>
  );
};

const markdownStyles = StyleSheet.create({
  // Body text
  text: {
    color: "#1D252C",
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

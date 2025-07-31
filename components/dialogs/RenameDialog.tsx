import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Text, TextInput, View } from "react-native";
import { ButtonDefault } from "../button/ButtonDefault";
import { ButtonMain } from "../button/ButtonMain";

type Props = {
  visible: boolean;
  currentValue: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  onCancel: () => void;
  onConfirm: (newValue: string) => void;
};

export const RenameDialog = ({
  visible,
  currentValue,
  title = "Rename",
  confirmText = "Save",
  cancelText = "Cancel",
  onCancel,
  onConfirm,
}: Props) => {
  const [text, setText] = useState(currentValue);

  useEffect(() => {
    if (visible) setText(currentValue);
  }, [visible, currentValue]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 24,
            width: "100%",
            maxWidth: 400,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>{title}</Text>

          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} >
            <TextInput
              value={text}
              onChangeText={setText}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 10,
                borderRadius: 8,
                marginBottom: 20,
                fontSize: 16,
              }}
              placeholder="Enter new name"
            />
          </KeyboardAvoidingView>

          <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 10 }}>
            <ButtonDefault onPress={onCancel} label={cancelText} flex={false} />
            <ButtonMain onPress={() => onConfirm(text)} disabled={!text.trim()} label={confirmText} flex={false} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

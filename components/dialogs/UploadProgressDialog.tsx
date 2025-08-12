import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type UploadProgressDialogProps = {
  progress?: number | boolean;
};

export const UploadProgressDialog: React.FC<UploadProgressDialogProps> = ({ progress }) => {
  if (progress === false) return null;

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <View style={styles.box}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Uploading… {progress != null ? `${progress}%` : ""}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  box: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    width: 200,
    alignItems: "center",
  },
  text: {
    marginTop: 12,
    fontSize: 16,
  },
});

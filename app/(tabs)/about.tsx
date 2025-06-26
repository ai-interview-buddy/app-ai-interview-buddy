import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About screen</Text>

                <Box className="flex flex-row">
            <Link href="/" asChild>
              <Button action="primary">
                <ButtonText>B3</ButtonText>
              </Button>
            </Link>
          </Box>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});

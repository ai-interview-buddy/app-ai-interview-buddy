import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Link } from "expo-router";
import { StyleSheet, Text } from "react-native";

export default function Index() {
  return (
    <Center>
      <Box className="p-5 max-w-96 border border-background-300 rounded-lg">
        <VStack className="pb-4" space="xs">
          <Heading className="leading-[30px]">Set new password</Heading>
          <Text className="text-sm">Almost done. Enter your new password and you are all set.</Text>

          <Text style={styles.text}>Home screen</Text>
          <Link href="/about" style={styles.button}>
            Go to About screen
          </Link>

          <Button action="primary">
            <ButtonText>B1</ButtonText>
          </Button>

          <Button action="secondary">
            <ButtonText>B1</ButtonText>
          </Button>

          <Button action="positive">
            <ButtonText>B1</ButtonText>
          </Button>

          <Button action="negative">
            <ButtonText>B1</ButtonText>
          </Button>

          <Button action="default">
            <ButtonText>B1</ButtonText>
          </Button>
        </VStack>

        <VStack space="lg" className="pt-4">
          <Button size="sm">
            <ButtonText>Submit</ButtonText>
          </Button>
          <Box className="flex flex-row">
            <Link href="/auth" asChild>
              <Button variant="link" size="sm" className="p-0">
                <ButtonText>Back to login x</ButtonText>
              </Button>
            </Link>
          </Box>
          <Box className="flex flex-row">
            <Link href="/auth/signin"  asChild>
              <Button action="primary">
                <ButtonText>B1</ButtonText>
              </Button>
            </Link>
          </Box>
        </VStack>
      </Box>
    </Center>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#25292e",
    // alignItems: "center",
    // justifyContent: "center",
  },
  text: {
    // color: "#fff",
  },
  button: {
    // fontSize: 20,
    // textDecorationLine: "underline",
    // color: "#fff",
  },
});

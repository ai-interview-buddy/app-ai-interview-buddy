import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { GoogleIcon } from "@/components/ui/custom-icons/google";
import { Image } from "@/components/ui/image";
import { Link } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const SignIn = () => {
  return (
    <SafeAreaView className="w-full h-full">
      <ScrollView className="w-full h-full" contentContainerStyle={{ flexGrow: 1 }}>
        <HStack className="w-full h-full bg-background-0 flex-grow justify-center">
          <VStack className="relative hidden md:flex h-full w-full flex-1  items-center  justify-center" space="md">
            <Image source={require("@/assets/images/radialGradient.png")} className="object-cover h-full w-full" alt="Radial Gradient" />
          </VStack>
          <VStack className="md:items-center md:justify-center flex-1 w-full  p-9 md:gap-10 gap-16 md:m-auto md:w-1/2 h-full">
            <VStack className="max-w-[440px] w-full" space="md">
              <VStack className="md:items-center" space="md">
                <VStack>
                  <Heading className="md:text-center" size="3xl">
                    Log in
                  </Heading>
                  <Text>Login to start using gluestack</Text>
                </VStack>
              </VStack>
              <VStack className="w-full">
                <VStack className="w-full my-7 " space="lg">
                  <Button className="w-full" onPress={() => console.log("clicked")}>
                    <ButtonText className="font-medium">Log in</ButtonText>
                  </Button>
                  <Button variant="outline" action="secondary" className="w-full gap-1" onPress={() => {}}>
                    <ButtonText className="font-medium">Continue with Google</ButtonText>
                    <ButtonIcon as={GoogleIcon} />
                  </Button>
                </VStack>
                <HStack className="self-center" space="sm">
                  <Text size="md">Don&apos;t have an account?</Text>
                  <Link href="/" asChild>
                    Sign up
                  </Link>
                </HStack>
              </VStack>
            </VStack>
          </VStack>
        </HStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

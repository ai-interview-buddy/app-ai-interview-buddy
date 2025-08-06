import { MainAction } from "@/components/button/MainAction";
import { MainContainer } from "@/components/container/MainContainer";
import { CenteredTextHeading } from "@/components/headers/CenteredTextHeading";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Dimensions, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

const { width } = Dimensions.get("window");

const OfferReceivedView: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const cannonLeft = useRef<ConfettiCannon>(null);
  const cannonCenter = useRef<ConfettiCannon>(null);
  const cannonRight = useRef<ConfettiCannon>(null);

  const handleBack = () => router.push(`/job-position/${id}`);
  const handleCancel = () => router.push("/job-position/");

  useEffect(() => {
    // stagger three bursts for depth
    setTimeout(() => cannonLeft.current?.start(), 0);
    setTimeout(() => cannonCenter.current?.start(), 300);
    setTimeout(() => cannonRight.current?.start(), 600);
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainContainer>
        <TitleBackHeader pageTitle="Offer Received" handleBack={handleBack} handleCancel={handleCancel} />

        {/* Left-side burst */}
        <ConfettiCannon
          ref={cannonLeft}
          count={100}
          origin={{ x: 0, y: 0 }}
          explosionSpeed={250} // faster, snappier burst
          fallSpeed={2200} // graceful, but not too slow
          fadeOut={true} // pieces fade rather than abruptly vanish
        />

        {/* Center burst */}
        <ConfettiCannon
          ref={cannonCenter}
          count={150}
          origin={{ x: width / 2, y: 0 }}
          explosionSpeed={300}
          fallSpeed={2400}
          fadeOut={true}
        />

        {/* Right-side burst */}
        <ConfettiCannon ref={cannonRight} count={100} origin={{ x: width, y: 0 }} explosionSpeed={250} fallSpeed={2200} fadeOut={true} />

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 20,
          }}
        >
          <CenteredTextHeading
            title="Congratulations!! 🎉🎉"
            subtitle="Sweet success! Your journey here is complete; sit back and enjoy the moment."
          />
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: "#FEFBED",
            borderRadius: 12,
          }}
        >
          <MainAction onPress={async () => handleCancel()}>Done</MainAction>
        </View>
      </MainContainer>
    </>
  );
};

export default OfferReceivedView;

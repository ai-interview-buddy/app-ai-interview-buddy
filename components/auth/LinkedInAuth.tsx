import { Button, ButtonText } from "@/components/ui/button";
import { IconArrowForward, IconLinkedIn } from "../misc/StyledIcons";
import { Box } from "../ui/box";
import { Text } from "../ui/text";

export default function LinkedInAuth() {
  return (
    <Button size="xl" action="primary" className="flex-row items-center justify-center">
      <ButtonText className="ml-2">
        <Box className="flex flex-row place-items-center gap-1">
          <IconLinkedIn />
          <Text className="flex-1 text-base font-bold dark:text-white text-gray-900 tracking-wide">Continue with LinkedIn</Text>
          <IconArrowForward />
        </Box>
      </ButtonText>
    </Button>
  );
}

import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuthStore } from "@/lib/supabase/authStore";

export default function TailWindCss() {
  const { isLogged, user, logOut } = useAuthStore();
  const date = new Date(user!!.expiresAt!! * 1000).toISOString();
  return (
    <VStack className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">Welcome to Nativewind x4!</Text>
      <Text className="text-xl font-bold text-orange-500">{isLogged ? "true" : "false"}</Text>
      <Text className="text-xs font-bold text-fusica-500">{user?.name}</Text>
      <Text className="text-xs font-bold text-orange-500">{user?.accessToken}</Text>
      <Text className="text-xs font-bold text-pink-500">{user?.avatar}</Text>
      <Text className="text-xs font-bold text-green-500">{date}</Text>
      <Button onPress={logOut}>
        <ButtonText>logout</ButtonText>
      </Button>
    </VStack>
  );
}

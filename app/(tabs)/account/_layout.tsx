import { Stack } from 'expo-router';

export default function AccountStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{ title: 'Account'}}
      />
    </Stack>
  );
}

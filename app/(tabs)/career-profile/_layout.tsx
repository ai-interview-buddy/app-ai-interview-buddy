import { Stack } from 'expo-router';

export default function JobPositionsStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{ title: 'Job positions'}}
      />
    </Stack>
  );
}

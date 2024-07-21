import { Stack } from "expo-router";

export default function PriceLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="[price]" />
    </Stack>
  );
}

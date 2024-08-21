import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function InvoiceLayout() {
  const theme = useColorScheme() ?? "light";
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors[theme].primaryContainer },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Facturas" }} />
      <Stack.Screen name="[invoice]" />
    </Stack>
  );
}

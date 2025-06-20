import { Colors } from "@/constants/Colors";
import {
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import { useColorScheme } from "react-native";
import { IconButton } from "react-native-paper";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: 'index',
};

export default function PriceLayout() {
  const theme = useColorScheme() ?? "light";
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors[theme].primaryContainer },
      }}
      initialRouteName="index"
    >
      <Stack.Screen name="index" options={{ title: "Cotizaciones" }} />
      <Stack.Screen name="[price]" />
      <Stack.Screen
        name="[...items]"
        options={{ title: "Lista de servicios", presentation: "modal" }}
      />
      <Stack.Screen name="preview/[price]" options={{ title: "Cotización" }} />
    </Stack>
  );
}

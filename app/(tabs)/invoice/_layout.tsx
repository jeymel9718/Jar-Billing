import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: 'index',
};

export default function InvoiceLayout() {
  const theme = useColorScheme() ?? "light";
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors[theme].primaryContainer },
      }}
      initialRouteName="index"
    >
      <Stack.Screen name="index" options={{ title: "Facturas" }} />
      <Stack.Screen name="[invoice]" />
      <Stack.Screen
        name="[...items]"
        options={{ title: "Lista de servicios", presentation: "modal" }}
      />
      <Stack.Screen name="new-invoice" options={{ headerTransparent: true, title: 'Nueva Factura', headerStyle: {backgroundColor: 'transparent' }}}/>
      <Stack.Screen name="preview/[invoice]" options={{ title: "Factura" }} />
    </Stack>
  );
}

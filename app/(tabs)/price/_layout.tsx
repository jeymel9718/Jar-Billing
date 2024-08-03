import { Colors } from "@/constants/Colors";
import { Stack, useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "react-native";
import { IconButton } from "react-native-paper";

export default function PriceLayout() {
  const theme = useColorScheme() ?? 'light';
  const params = useGlobalSearchParams<{ price: string }>();
  const price = params.price == 'new' ? 'Nueva': params.price;

  return (
    <Stack screenOptions={{headerStyle: {backgroundColor: Colors[theme].primaryContainer}}}>
      <Stack.Screen name="index" options={{title: "Cotizaciones", headerRight: props => <IconButton icon='magnify' {...props}/>}}/>
      <Stack.Screen name="[price]" options={{title: price}}/>
      <Stack.Screen name="items" options={{title: 'Lista de servicios', presentation: 'modal'}}/>
    </Stack>
  );
}

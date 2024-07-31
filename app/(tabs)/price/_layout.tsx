import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { IconButton } from "react-native-paper";

export default function PriceLayout() {
  const theme = useColorScheme() ?? 'light';

  return (
    <Stack screenOptions={{headerStyle: {backgroundColor: Colors[theme].primaryContainer}}}>
      <Stack.Screen name="index" options={{title: "Cotizaciones", headerRight: props => <IconButton icon='magnify' {...props}/>}}/>
      <Stack.Screen name="[price]" />
    </Stack>
  );
}

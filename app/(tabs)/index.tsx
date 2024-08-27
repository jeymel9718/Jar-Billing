import {
  Image,
  StyleSheet,
  Platform,
  Dimensions,
  Pressable,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { Text, Surface } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useEvents } from "@/hooks/useEvents";
import { useMemo } from "react";

const windowDimensions = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation();

  const events = useEvents();

  const nextEvent = useMemo(() => {
    if (events.length === 0) {
      return { name: "No hay evento proximo", date: "" };
    }

    return { name: events[0].name, date: events[0].date.toLocaleString() };
  }, [events]);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/jar.jpeg")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">¡Bienvenido!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.container}>
        <Surface elevation={4} style={styles.eventContainer}>
          <Text variant="titleLarge" style={{fontWeight: 'bold'}}>Proxima cita</Text>
          <Text variant="titleMedium">{nextEvent.name}</Text>
          <Text variant="titleMedium" style={{opacity:0.5}}>{nextEvent.date}</Text>
        </Surface>
        <ThemedView style={styles.rowContainer}>
          <Pressable
            onPress={() =>
              navigation.navigate("price", {
                screen: "[price]",
                initial: false,
                params: { price: "new" },
              })
            }
          >
            <Surface style={styles.boxContainer} elevation={4}>
              <Ionicons size={30} name="reader" />
              <Text>Agregar nueva cotización</Text>
            </Surface>
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate("invoice", {
                screen: "new-invoice",
                initial: false,
              })
            }
          >
            <Surface style={styles.boxContainer} elevation={4}>
              <Ionicons size={30} name="receipt" />
              <Text>Agregar nueva factura</Text>
            </Surface>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  container: {
    flex: 1,
    gap: 25
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  rowContainer: {
    flexDirection: "row",
    alignContent: "space-around",
    justifyContent: "space-around",
  },
  eventContainer: {
    borderRadius: 16,
    padding: 15,
  },
  boxContainer: {
    height: windowDimensions.height * 0.12,
    width: windowDimensions.width * 0.34,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
});

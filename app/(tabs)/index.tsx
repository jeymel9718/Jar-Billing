import { Image, StyleSheet, Platform, Dimensions } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { Text, Surface } from "react-native-paper";

const windowDimensions = Dimensions.get("window");

export default function HomeScreen() {
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
        <ThemedView style={styles.rowContainer}>
          <Surface style={styles.boxContainer} elevation={4}>
            <Ionicons size={30} name="reader" />
            <Text>Agregar nueva cotización</Text>
          </Surface>
          <Surface style={styles.boxContainer} elevation={4}>
            <Ionicons size={30} name="receipt" />
            <Text>Agregar nueva factura</Text>
          </Surface>
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
    flex: 1
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    alignContent: 'space-around',
    justifyContent: 'space-around'
  },
  boxContainer: {
    height: windowDimensions.height*0.12,
    width: windowDimensions.width*0.34,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
});

import ReceiptItem from "@/components/ReceiptItem";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Card, Chip, Divider, Text, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";

const DATA = [{ quantity: 0, cost: 0, amount: 0, description: "" }];
const windowDimensions = Dimensions.get("window");

const buttonTheme = {
  roundness: 10,
};

export default function PriceScreen() {
  const theme = useColorScheme() ?? "light";
  const router = useRouter();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors[theme].background }]}
    >
      <Text variant="titleLarge" style={styles.sectionText}>
        Detalles del cliente
      </Text>
      <Card>
        <Card.Content style={styles.cardContent}>
          <TextInput
            mode="outlined"
            label="Nombre del cliente"
            theme={buttonTheme}
            style={styles.button}
          />
          <TextInput
            mode="outlined"
            label="Número de teléfono"
            theme={buttonTheme}
            style={styles.button}
          />
          <TextInput
            mode="outlined"
            label="Correo electrónico"
            theme={buttonTheme}
            style={styles.button}
          />
        </Card.Content>
      </Card>
      <Text variant="titleLarge" style={[styles.sectionText, { marginTop: 7 }]}>
        Detalles de los servicios
      </Text>
      <Card
        style={{
          marginTop: 5,
          position: "relative",
          marginBottom: 25,
          padding: 0,
        }}
      >
        <Card.Content
          style={{
            justifyContent: "center",
            alignContent: "center",
            padding: 0,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "space-between",
              paddingVertical: 10,
            }}
          >
            <Text variant="titleSmall">Descripción del item</Text>
            <Text variant="titleSmall">320520</Text>
          </View>
          <Divider style={{ padding: 0, width: "100%" }} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "space-between",
              paddingVertical: 10,
            }}
          >
            <Text variant="titleSmall">Descripción del item</Text>
            <Text variant="titleSmall">₡320520</Text>
          </View>
          <Divider />

          <Chip icon="plus" compact onPress={() => router.navigate("/price/items")} style={styles.addItem}>
            Añadir servicio
          </Chip>
        </Card.Content>
      </Card>
      <Card>
        <Card.Content style={{ position: "relative", gap: 2, zIndex: -1 }}>
          <View style={styles.inlineContainer}>
            <Text style={styles.textOpacity} variant="titleSmall">
              Sub total
            </Text>
            <Text variant="titleSmall">₡25356</Text>
          </View>
          <View style={[styles.inlineContainer, { marginBottom: 15 }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                gap: 5,
              }}
            >
              <Text variant="titleSmall" style={styles.textOpacity}>
                Descuento
              </Text>
              <Ionicons
                name="create-outline"
                size={20}
                color={Colors[theme].primary}
              />
            </View>
            <Text variant="titleSmall">₡0</Text>
          </View>
          <View
            style={[
              styles.inlineContainer,
              {
                backgroundColor: Colors[theme].secondaryContainer,
                position: "absolute",
                bottom: 0,
                left: 0,
                paddingHorizontal: 15,
                width: windowDimensions.width * 0.917,
                height: "48%",
                borderBottomEndRadius: 10,
                borderBottomStartRadius: 10,
              },
            ]}
          >
            <Text style={styles.textOpacity} variant="titleSmall">
              Total
            </Text>
            <Text variant="titleSmall">₡25356</Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  sectionText: {
    opacity: 0.5,
    marginBottom: 7,
  },
  button: {
    height: windowDimensions.height * 0.05,
  },
  cardContent: {
    gap: 6,
  },
  textOpacity: {
    opacity: 0.35,
  },
  addItem: {
    position: "absolute",
    bottom: -19,
    right: windowDimensions.width * 0.25,
    borderRadius: 40,
    zIndex: 1,
  },
  inlineContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "space-between",
  },
});

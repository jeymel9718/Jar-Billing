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
import { HeaderButtonProps } from "@react-navigation/native-stack/src/types";
import {
  Button,
  Card,
  Chip,
  Divider,
  Text,
  TextInput,
} from "react-native-paper";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useState, useEffect, useMemo } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const DATA = [{ quantity: 0, cost: 0, amount: 0, description: "" }];
const windowDimensions = Dimensions.get("window");

const buttonTheme = {
  roundness: 10,
};

export default function PriceScreen() {
  const [date, setDate] = useState(new Date());
  const theme = useColorScheme() ?? "light";
  const { price } = useLocalSearchParams<{ price: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const formattedDate = useMemo(() => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const day = date.getDate();
    const formattedDate = `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
    return formattedDate;
  }, [date]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showDatepicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: "date",
      is24Hour: true,
    });
  };

  useEffect(() => {
    navigation.setOptions({
      title: price,
      headerRight: (props: HeaderButtonProps) => (
        <Button icon="content-save" {...props}>
          Guardar
        </Button>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (price === "new") {
      console.info("new item, create draw price");
    }
  }, [price]);

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
          <Button onPress={showDatepicker}>Fecha: {formattedDate}</Button>
        </Card.Content>
      </Card>
      <Text variant="titleLarge" style={[styles.sectionText, { marginTop: 7 }]}>
        Detalles de los servicios
      </Text>
      <Card
        style={{
          marginTop: 5,
          position: "relative",
          marginBottom: 20,
          paddingBottom: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "space-between",
            padding: 10,
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
            padding: 10,
          }}
        >
          <Text variant="titleSmall">Descripción del item</Text>
          <Text variant="titleSmall">₡320520</Text>
        </View>
        <Divider />

        <Chip
          icon="plus"
          compact
          onPress={() => router.navigate(`/price/items/${price}`)}
          style={styles.addItem}
        >
          Añadir servicio
        </Chip>
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
    bottom: -31,
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

import ListItem from "@/components/ListItem";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { database } from "@/firebase/database";
import { useCounters } from "@/hooks/useCounters";
import { usePrices } from "@/hooks/usePrices";
import { formatCurrency } from "@/utils/functions";
import { ItemProps } from "@/utils/types";
import { Link, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { FlatList } from "react-native";
import {
  Icon,
  Portal,
  Modal,
  Surface,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native-paper";

const windowDimensions = Dimensions.get("window");

export default function NewInvoice() {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const [search, onChangeSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const prices = usePrices();

  const counter = useCounters("invoice");

  const filteredPrices = useMemo(() => {
    if (search) {
      return prices.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      return prices;
    }
  }, [prices, search]);

  const selectPrice = (index: number, id: string) => {
    setSelectedId(id);
    setSelectedIdx(index);
  } 

  const createInvoice = async () => {
    setModalVisible(false);
    setIsCreating(true);
    const price = filteredPrices[selectedIdx];
    price.status = 'pending';
    const invoiceRef = database.getNewRef('invoice');
    price.id = invoiceRef.key;
    price.orderId = `${counter + 1}`;
    await database.pushData(invoiceRef, {...price});
    await database.incrementInvoices();
    
    // Create Invoice Items
    const invoiceItemsRef = database.getRef(`invoice-items/${price.id}`);
    const snapshot = await database.readOnce(`price-items/${selectedId}`);
    if (snapshot.exists()) {
      database.pushData(invoiceItemsRef, snapshot.val()).then(() => {
        setIsCreating(false);
        router.navigate(`/invoice/${price.id}`);
      }).catch(() => {
        console.error("Failed to create invoice items");
        setIsCreating(false);
      });
    } else {
      console.error("Failed to create get price items");
    }
  };

  if (isCreating) {
    return (
      <ThemedView style={styles.activityContainer}>
        <ActivityIndicator size={windowDimensions.height*0.3} animating={true}/>
        <Text variant="headlineMedium">Creando factura...</Text>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <Portal>
        <Modal
          visible={modalVisible}
          contentContainerStyle={styles.modal}
          onDismiss={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView>
            <View style={styles.buttonsView}>
              <Button
                textColor={Colors[theme].error}
                onPress={() => setModalVisible(false)}
              >
                Cancelar
              </Button>
              <Button onPress={createInvoice} disabled={selectedId === ""}>Crear</Button>
            </View>
            <TextInput
              value={search}
              onChangeText={onChangeSearch}
              placeholder="Buscar..."
            />
            <FlatList
              data={filteredPrices}
              renderItem={({ index, item }) => (
                  <ListItem
                    {...item}
                    onPress={() => selectPrice(index, item.id)}
                    colorScheme={theme}
                    style={
                      selectedId === item.id
                        ? {
                            borderColor: Colors[theme].primary,
                            borderWidth: 2,
                            borderRadius: 20,
                          }
                        : {}
                    }
                  />
              )}
              keyExtractor={(item) => item.id}
            />
          </KeyboardAvoidingView>
        </Modal>
      </Portal>
      <Pressable onPress={() => setModalVisible(true)}>
        <Surface style={styles.surfaceContainer}>
          <Icon
            source="file-document-multiple"
            size={windowDimensions.height * 0.16}
            color={Colors[theme].secondary}
          />
          <Text variant="headlineSmall" style={styles.text}>
            Crear desde una cotización
          </Text>
        </Surface>
      </Pressable>
      <Link asChild href="/invoice/new">
        <Pressable>
          <Surface style={styles.surfaceContainer}>
            <Icon
              source="file-document"
              size={windowDimensions.height * 0.16}
              color={Colors[theme].tertiary}
            />
            <Text variant="headlineSmall" style={styles.text}>
              Crear nueva factura
            </Text>
          </Surface>
        </Pressable>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    height: windowDimensions.height,
  },
  activityContainer: {
    gap: 5,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    height: windowDimensions.height,
  },
  surfaceContainer: {
    height: windowDimensions.height * 0.45,
    width: windowDimensions.width * 0.45,
    borderRadius: 10,
    gap: 12,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
  },
  listView: {
    padding: 10,
  },
  buttonsView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modal: {
    flex: 1,
    backgroundColor: "white",
    alignSelf: "center",
    position: "absolute",
    bottom: 0,
    width: windowDimensions.width,
    height: windowDimensions.height * 0.56,
    paddingVertical: 45,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
});

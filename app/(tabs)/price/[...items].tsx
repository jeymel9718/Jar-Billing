import { ThemedView } from "@/components/ThemedView";
import { database } from "@/firebase/database";
import { ItemProps } from "@/utils/types";
import { HeaderButtonProps } from "@react-navigation/native-stack/src/types";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  Button,
  Card,
  Dialog,
  IconButton,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";

function generateRandomId(length: number = 16): string {
  return Math.random().toString(36).substr(2, length);
}

const buttonTheme = {
  roundness: 15,
};

const windowDimensions = Dimensions.get("window");

const Item = ({
  item,
  index,
  onDelete,
  onCostChange,
  onPriceChange,
  onDescriptionChange,
}: {
  item: ItemProps;
  index: number;
  onDelete: (index: number) => void;
  onCostChange: (index: number, value: string) => void;
  onPriceChange: (index: number, value: string) => void;
  onDescriptionChange: (index: number, value: string) => void;
}) => (
  <Card style={styles.itemContainer}>
    <TextInput
      label="Descripción"
      value={item.description}
      style={styles.inputText}
      theme={buttonTheme}
      onChangeText={(text) => onDescriptionChange(index, text)}
    />
    <View style={styles.costContainer}>
      <TextInput
        label="Precio"
        style={styles.costInput}
        theme={buttonTheme}
        value={item.price}
        onChangeText={(text) => onPriceChange(index, text)}
      />
      <TextInput
        label="Costo"
        style={styles.costInput}
        theme={buttonTheme}
        value={item.cost}
        onChangeText={(text) => onCostChange(index, text)}
      />
    </View>
    <Card.Actions>
      <Button
        icon="delete"
        mode="contained-tonal"
        onPress={() => onDelete(index)}
      >
        Eliminar
      </Button>
    </Card.Actions>
  </Card>
);

export default function ItemsScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const indexRef = useRef(0);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [itemsData, setItemsData] = useState<ItemProps[]>([]);
  const db = database;
  const { items } = useLocalSearchParams<{ items: string[] }>();
  const priceId = items[1];

  useEffect(() => {
    navigation.setOptions({
      headerRight: (props: HeaderButtonProps) => (
        <Button icon="content-save" onPress={saveData} {...props}>
          Guardar
        </Button>
      ),
    });

    db.readOnce(`price-items/${priceId}`).then((snapshot) => {
      if (snapshot.exists()) {
        const databaseItems: ItemProps[] = [];
        Object.values(snapshot.val()).forEach((item) =>
          databaseItems.push(item as ItemProps)
        );
        setItemsData(databaseItems);
      }
    });
  }, [navigation, itemsData]);

  const newItem = () => {
    const newData = itemsData.concat({
      id: "",
      description: "",
      cost: "0",
      price: "0",
    });
    setItemsData(newData);
  };

  const deleteItem = () => {
    db.deleteData(`price-items/${priceId}/${itemsData[indexRef.current].id}`)
      .then(() => {
        itemsData.splice(indexRef.current, 1);
        setItemsData([...itemsData]);
        setDeleteVisible(false);
      })
      .catch((error) => {
        return;
      });
  };

  const handleCostChange = (index: number, value: string) => {
    itemsData[index].cost = value.replace(/[^0-9]+/g, "");
    setItemsData([...itemsData]);
  };

  const handlePriceChange = (index: number, value: string) => {
    itemsData[index].price = value.replace(/[^0-9]+/g, "");
    setItemsData([...itemsData]);
  };

  const handleDescription = (index: number, value: string) => {
    itemsData[index].description = value;
    setItemsData([...itemsData]);
  };

  const saveData = useCallback(async () => {
    setVisible(true);
    setLoading(true);
    await itemsData.forEach(async (item) => {
      try {
        // new item, create it on database
        if (item.id === "") {
          const dbRef = db.getNewRef(`price-items/${priceId}`);
          item.id = dbRef.key;
          await db.pushData(dbRef, { ...item });
        }
        // Update the current item
        else {
          const path = `price-items/${priceId}/${item.id}`;
          await db.updateData(path, { ...item });
        }
      } catch (error) {
        setLoading(false);
        setError("No fue posible actualizar los datos.\n Intente mas tarde.");
        return;
      }
    });
    setLoading(false);
    setVisible(false);
    router.back();
  }, [itemsData]);

  const dismissDialog = () => {
    setError("");
    setVisible(false);
  };

  const showDelete = (index: number) => {
    indexRef.current = index;
    setDeleteVisible(true);
  };

  return (
    <ThemedView>
      <Portal>
        <Dialog visible={visible}>
          <Dialog.Title>Editar servicio</Dialog.Title>
          {loading && (
            <Dialog.Content>
              <Text variant="titleMedium">Guardando nuevos cambios...</Text>
              <ActivityIndicator animating={loading} size={"large"} />
            </Dialog.Content>
          )}
          {!loading && error === "" && (
            <Dialog.Content>
              <Text variant="titleMedium">Cambios guardados con éxito</Text>
            </Dialog.Content>
          )}
          {error !== "" && !loading && (
            <Dialog.Content>
              <Text variant="labelLarge">{error}</Text>
            </Dialog.Content>
          )}
          {!loading && (
            <Dialog.Actions>
              <Button onPress={() => dismissDialog()}>Aceptar</Button>
            </Dialog.Actions>
          )}
        </Dialog>
        <Dialog visible={deleteVisible}>
          <Dialog.Title>Eliminar servicio</Dialog.Title>
          <Dialog.Content><Text variant="titleMedium">¿Desea eliminar el servicio?</Text></Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteVisible(false)}>Cancelar</Button>
            <Button onPress={() => deleteItem()}>Aceptar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <FlatList
        data={itemsData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Item
            item={itemsData[index]}
            index={index}
            onDelete={showDelete}
            onCostChange={handleCostChange}
            onDescriptionChange={handleDescription}
            onPriceChange={handlePriceChange}
          />
        )}
        ListEmptyComponent={
          <Text variant="titleLarge" style={styles.emptyText}>
            No hay servicios asociados
          </Text>
        }
        ListFooterComponent={
          <IconButton
            icon="plus"
            size={windowDimensions.width * 0.1}
            onPress={newItem}
            style={styles.addButton}
            mode="contained"
          />
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    alignSelf: "center",
    fontWeight: "bold",
    padding: 7,
  },
  itemContainer: {
    padding: 5,
    margin: 5,
  },
  costContainer: {
    flexDirection: "row",
    alignContent: "space-around",
    justifyContent: "space-around",
    marginVertical: 5,
  },
  costInput: {
    height: windowDimensions.height * 0.05,
    width: "46%",
  },
  inputText: {
    height: windowDimensions.height * 0.05,
  },
  addButton: {
    alignSelf: "center",
  },
});

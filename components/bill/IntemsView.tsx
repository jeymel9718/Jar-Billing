import { Item } from "@/components/bill/Item";
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
import { Button, Dialog, IconButton, Portal, Text } from "react-native-paper";

const windowDimensions = Dimensions.get("window");

export type ItemsViewProps = {
  billType: string;
  id: string;
};

export function ItemsView({ billType, id }: ItemsViewProps) {
  const navigation = useNavigation();
  const router = useRouter();
  const indexRef = useRef(0);
  const flatListRef = useRef<FlatList>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [itemsData, setItemsData] = useState<ItemProps[]>([]);
  const db = database;

  useEffect(() => {
    navigation.setOptions({
      headerRight: (props: HeaderButtonProps) => (
        <Button icon="content-save" onPress={saveData} {...props}>
          Guardar
        </Button>
      ),
    });
  }, [navigation, itemsData]);

  useEffect(() => {
    db.readOnce(`${billType}-items/${id}`).then((snapshot) => {
      if (snapshot.exists()) {
        const databaseItems: ItemProps[] = [];
        Object.values(snapshot.val()).forEach((item) =>
          databaseItems.push(item as ItemProps)
        );
        setItemsData(databaseItems);
      }
    });
  }, []);

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
    if (itemsData[indexRef.current].id === "") {
      itemsData.splice(indexRef.current, 1);
      setItemsData([...itemsData]);
      setDeleteVisible(false);
    } else {
      db.deleteData(`${billType}-items/${id}/${itemsData[indexRef.current].id}`)
        .then(() => {
          itemsData.splice(indexRef.current, 1);
          setItemsData([...itemsData]);
          setDeleteVisible(false);
        })
        .catch((error) => {
          return;
        });
    }
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

  const scrollToInput = useCallback(
    (index: number) => {
      flatListRef.current?.scrollToIndex({ index, animated: true });
    },
    [flatListRef]
  );

  const saveData = async () => {
    setVisible(true);
    setLoading(true);
    await itemsData.forEach(async (item) => {
      try {
        // new item, create it on database
        if (item.id === "") {
          const dbRef = db.getNewRef(`${billType}-items/${id}`);
          item.id = dbRef.key;
          await db.pushData(dbRef, { ...item });
        }
        // Update the current item
        else {
          const path = `${billType}-items/${id}/${item.id}`;
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
  };

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
          <Dialog.Content>
            <Text variant="titleMedium">¿Desea eliminar el servicio?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteVisible(false)}>Cancelar</Button>
            <Button onPress={() => deleteItem()}>Aceptar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <FlatList
        ref={flatListRef}
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
            scrollCallback={scrollToInput}
          />
        )}
        ListEmptyComponent={
          <Text variant="titleLarge" style={styles.emptyText}>
            No hay servicios asociados
          </Text>
        }
        ListFooterComponent={
          <View style={{ marginBottom: windowDimensions.height * 0.4 }}>
            <IconButton
              icon="plus"
              size={windowDimensions.width * 0.1}
              onPress={newItem}
              style={styles.addButton}
              mode="contained"
            />
          </View>
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

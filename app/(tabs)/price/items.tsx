import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { FlatList, View, StyleSheet, Dimensions } from "react-native";
import { Button, Card, IconButton, Text, TextInput } from "react-native-paper";

function generateRandomId(length: number = 16): string {
  return Math.random().toString(36).substr(2, length);
}

const buttonTheme = {
  roundness: 15,
};

const windowDimensions = Dimensions.get("window");

type ItemProps = {
  id: string;
  description: string;
  cost: string;
  price: string;
};

const Item = () => (
  <Card style={styles.itemContainer}>
    <TextInput label="Descripción" style={styles.inputText} theme={buttonTheme} />
    <View style={styles.costContainer}>
      <TextInput label="Precio" style={styles.costInput} theme={buttonTheme}  />
      <TextInput label="Costo" style={styles.costInput} theme={buttonTheme} />
    </View>
    <Card.Actions>
      <Button icon="delete" mode="contained-tonal" >
        Eliminar
      </Button>
    </Card.Actions>
  </Card>
);

export default function ItemsScreen() {
  const [data, setData] = useState<ItemProps[]>([]);

  const newItem = () => {
    const newData = data.concat({
      id: generateRandomId(),
      description: "",
      cost: "",
      price: "",
    });
    setData(newData);
  };
  return (
    <ThemedView>
      <FlatList
        data={data}
        renderItem={({ item }) => <Item />}
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
    width: '46%',
  },
  inputText: {
    height: windowDimensions.height * 0.05,
  },
  addButton: {
    alignSelf: "center",
  },
});

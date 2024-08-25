import { ItemProps } from "@/utils/types";
import { Dimensions, StyleSheet, View } from "react-native";
import { Button, Card, TextInput } from "react-native-paper";

const buttonTheme = {
  roundness: 15,
};

const windowDimensions = Dimensions.get("window");

export function Item({
  item,
  index,
  onDelete,
  onCostChange,
  onPriceChange,
  onDescriptionChange,
  scrollCallback,
}: {
  item: ItemProps;
  index: number;
  onDelete: (index: number) => void;
  onCostChange: (index: number, value: string) => void;
  onPriceChange: (index: number, value: string) => void;
  onDescriptionChange: (index: number, value: string) => void;
  scrollCallback: (index: number) => void;
}) {
  return (
    <Card style={styles.itemContainer}>
    <TextInput
      label="Descripción"
      value={item.description}
      style={styles.inputText}
      theme={buttonTheme}
      onPressIn={() => scrollCallback(index)}
      onChangeText={(text) => onDescriptionChange(index, text)}
    />
    <View style={styles.costContainer}>
      <TextInput
        label="Precio"
        style={styles.costInput}
        theme={buttonTheme}
        value={item.price}
        onPressIn={() => scrollCallback(index)}
        onChangeText={(text) => onPriceChange(index, text)}
      />
      <TextInput
        label="Costo"
        style={styles.costInput}
        theme={buttonTheme}
        value={item.cost}
        onPressIn={() => scrollCallback(index)}
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
}

const styles = StyleSheet.create({
  costInput: {
    height: windowDimensions.height * 0.05,
    width: "46%",
  },
  costContainer: {
    flexDirection: "row",
    alignContent: "space-around",
    justifyContent: "space-around",
    marginVertical: 5,
  },
  itemContainer: {
    padding: 5,
    margin: 5,
  },
  inputText: {
    height: windowDimensions.height * 0.05,
  },
});
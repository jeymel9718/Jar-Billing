import { formatCurrency } from "@/utils/functions";
import { ItemProps } from "@/utils/types";
import { useRouter } from "expo-router";
import { Dimensions, StyleSheet, View } from "react-native";
import { Card, Chip, Divider, Text } from "react-native-paper";

const windowDimensions = Dimensions.get("window");

export type BillItemsProps = {
  items: ItemProps[];
  id: string;
  billKey: "price" | "invoice";
};

export function BillItems({ items, id, billKey }: BillItemsProps) {
  const router = useRouter();

  return (
    <Card
      style={{
        marginTop: 5,
        position: "relative",
        marginBottom: 20,
        paddingBottom: 15,
        marginHorizontal: 8,
      }}
    >
      {items.map((item, index) => (
        <View key={index}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "space-between",
              padding: 10,
            }}
          >
            <Text variant="titleSmall">{item.description}</Text>
            <Text variant="titleSmall">{formatCurrency(item.price)}</Text>
          </View>
          <Divider />
        </View>
      ))}
      <Chip
        icon="plus"
        compact
        onPress={() => router.navigate(`/${billKey}/${id}`)}
        style={styles.addItem}
      >
        Añadir servicio
      </Chip>
    </Card>
  );
}

const styles = StyleSheet.create({
  addItem: {
    position: "absolute",
    bottom: -31,
    right: windowDimensions.width * 0.25,
    borderRadius: 40,
    zIndex: 1,
  },
});

import { Colors } from "@/constants/Colors";
import { formatCurrency } from "@/utils/functions";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Dimensions, StyleSheet, useColorScheme, View } from "react-native";
import { Card, Text } from "react-native-paper";

const windowDimensions = Dimensions.get("window");

export type BillTotalProps = {
  subTotal: string;
  total: number;
  discount: string;
  onDiscountPress: () => void;
};

export function BillTotal({
  subTotal,
  total,
  discount,
  onDiscountPress,
}: BillTotalProps) {
  const theme = useColorScheme() ?? "light";

  return (
    <Card style={styles.cardContainer}>
      <Card.Content style={{ position: "relative", gap: 2, zIndex: -1 }}>
        <View style={styles.inlineContainer}>
          <Text style={styles.textOpacity} variant="titleSmall">
            Sub total
          </Text>
          <Text variant="titleSmall">{formatCurrency(subTotal)}</Text>
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
              onPress={onDiscountPress}
            />
          </View>
          <Text variant="titleSmall">-{discount}</Text>
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
              width: windowDimensions.width * 0.955,
              height: "48%",
              borderBottomEndRadius: 10,
              borderBottomStartRadius: 10,
            },
          ]}
        >
          <Text style={styles.textOpacity} variant="titleSmall">
            Total
          </Text>
          <Text variant="titleSmall">{formatCurrency(total)}</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  inlineContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "space-between",
  },
  cardContent: {
    gap: 6,
  },
  textOpacity: {
    opacity: 0.35,
  },
  cardContainer: {
    marginHorizontal: 8,
  },
});

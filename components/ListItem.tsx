import { Colors } from "@/constants/Colors";
import { formatCurrency } from "@/utils/functions";
import { Price } from "@/utils/types";
import { Link, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Divider, Text } from "react-native-paper";

const TextLine = ({
  textKey,
  value,
  style,
}: {
  textKey: string;
  value: string;
  style: any;
}) => {
  return (
    <View style={styles.textContainer}>
      <Text variant="labelMedium" style={styles.keyText}>
        {textKey}
      </Text>
      <Text variant="labelMedium" style={style}>
        {value}
      </Text>
    </View>
  );
};

export type ListItemProps = Price & {
  colorScheme?: "light" | "dark";
};

export default function ListItem({
  id,
  orderId,
  name,
  date,
  total,
  colorScheme,
}: ListItemProps) {
  const colorTheme = colorScheme ?? "light";
  const router = useRouter();
  return (
    <Card style={styles.cardContainer} onPress={() => router.navigate(`/price/${id}`)}>
      <Card.Title title={`#${orderId}`} titleVariant="titleMedium" />
      <Card.Content>
        <TextLine
          textKey="Nombre del cliente"
          value={name}
          style={{ color: Colors[colorTheme].primary }}
        />
        <TextLine
          textKey="Fecha"
          value={date}
          style={{ color: Colors[colorTheme].primary }}
        />
        <Divider style={styles.divider} />
        <Text variant="titleSmall">{formatCurrency(total)}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 10,
    marginHorizontal: 5,
  },
  divider: {
    height: 1,
    marginVertical: 2,
  },
  textContainer: {
    flex: 1,
    padding: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "space-between",
  },
  keyText: {
    opacity: 0.4,
  },
});

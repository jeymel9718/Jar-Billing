import { Colors } from "@/constants/Colors";
import { StyleSheet, View } from "react-native";
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

export type ListItemProps = {
  number: number;
  clientName: string;
  date: string;
  amount: string;
  colorScheme?: "light" | "dark";
};

export default function ListItem({
  number,
  clientName,
  date,
  amount,
  colorScheme,
}: ListItemProps) {
  const colorTheme = colorScheme ?? "light";
  return (
    <Card style={styles.cardContainer}>
      <Card.Title title={`#${number}`} titleVariant="titleMedium" />
      <Card.Content>
        <TextLine
          textKey="Nombre del cliente"
          value={clientName}
          style={{ color: Colors[colorTheme].primary }}
        />
        <TextLine
          textKey="Fecha"
          value={date}
          style={{ color: Colors[colorTheme].primary }}
        />
        <Divider style={styles.divider} />
        <Text variant="titleSmall">{amount} CRC</Text>
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
    marginVertical: 2
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
  }
});

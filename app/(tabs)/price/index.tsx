import ListItem from "@/components/ListItem";
import { ThemedView } from "@/components/ThemedView";
import { database } from "@/firebase/database";
import { Price } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { FlatList } from "react-native";
import { FAB } from "react-native-paper";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    number: 1001,
    clientName: "John Doo",
    date: "any",
    amount: "2336",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    number: 1002,
    clientName: "John Doo",
    date: "any",
    amount: "2336",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    number: 1003,
    clientName: "John Doo",
    date: "any",
    amount: "2336",
  },
];

export default function ListPriceScreen() {
  const db = database;
  const [prices, setPrices] = useState<Price[]>([]);
  const theme = useColorScheme() ?? 'light';

  useEffect(() => {
    const readReference = db.read("price", (snapshot) => {
      if (snapshot.exists()) {
        const data: Price[] = [];
        snapshot.forEach((child) => {
          data.push(child.val() as Price);
        });
        setPrices(data);
      }
    });

    return () => {db.stopRead("price", readReference)};
  }, []);

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={prices}
        renderItem={({ item }) => <ListItem {...item} colorScheme={theme} />}
        keyExtractor={(item) => item.id}
      />
      <Link asChild href="/price/new">
        <FAB
          icon={'plus'}
          style={styles.fabAdd}
          size='medium'
        />
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    paddingVertical: 32,
    paddingHorizontal: 20,
    gap: 16,
  },
  fabAdd: {
    position: "absolute",
    borderRadius: 50,
    bottom: 6,
    right: 4,
  },
});

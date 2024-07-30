import ListItem from "@/components/ListItem";
import { ThemedView } from "@/components/ThemedView";
import { Fab, FabLabel } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
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
  const theme = useColorScheme() ?? 'light';
  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={DATA}
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

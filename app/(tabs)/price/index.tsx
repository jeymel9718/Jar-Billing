import ListItem from "@/components/ListItem";
import { ThemedView } from "@/components/ThemedView";
import { Fab, FabLabel } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { FlatList } from "react-native";

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
  return (
    <ThemedView style={styles.container}>
      <HStack className="justify-between items-center">
        <Heading bold size="2xl">
          Cotizaciones
        </Heading>
        <Ionicons size={24} name="search" />
      </HStack>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <ListItem {...item} />}
        keyExtractor={(item) => item.id}
      />
      <Link asChild href="/price/new">
        <Pressable style={styles.fabAdd}>
          <Ionicons name="add" size={47} color="white" />
        </Pressable>
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
    backgroundColor: "rgb(163 230 53)",
    borderRadius: 50,
    bottom: 6,
    right: 4,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.19,
    shadowRadius: 5.62,
    elevation: 6,
  },
});

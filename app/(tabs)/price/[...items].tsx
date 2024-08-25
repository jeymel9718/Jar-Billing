import { ItemsView } from "@/components/bill/IntemsView";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import {
  StyleSheet,
  Dimensions,
} from "react-native";

const windowDimensions = Dimensions.get("window");

export default function PriceItemsScreen() {
  const { items } = useLocalSearchParams<{ items: string[] }>();
  const id = items[1];
  const billType = items[0];
  return <ItemsView billType={billType} id={id} />;
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

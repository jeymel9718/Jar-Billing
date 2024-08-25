import { ItemsView } from "@/components/bill/IntemsView";
import { useLocalSearchParams } from "expo-router";

export default function InvoiceItemsScreen() {
  const { items } = useLocalSearchParams<{ items: string[] }>();
  const id = items[1];
  const billType = items[0];
  return <ItemsView billType={billType} id={id} />;
}

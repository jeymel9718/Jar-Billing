import { Heading } from "./ui/heading";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

export type ListItemProps = {
  number: number;
  clientName: string;
  date: string;
  amount: string;
};

export default function ListItem({
  number,
  clientName,
  date,
  amount,
}: ListItemProps) {
  return(
    <VStack space="xs" className="m-2 p-4 rounded-3xl bg-slate-50 shadow-md">
      <Heading>#{number}</Heading>
      <Text bold>{clientName}</Text>
      <Text>{date}</Text>
      <Text size="lg" italic>{amount} CRC</Text>
    </VStack>
  );
}

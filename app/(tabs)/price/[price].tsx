import ReceiptItem from "@/components/ReceiptItem";
import { ThemedView } from "@/components/ThemedView";
import { Divider } from "@/components/ui/divider";
import { FormControl, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Dimensions, StyleSheet } from "react-native";
import { FlatList } from "react-native";

const DATA = [{quantity: 0, cost: 0, amount: 0, description: ""}]
const windowDimensions = Dimensions.get('window');

export default function PriceScreen() {
  return (
    <ThemedView style={styles.container}>
      <VStack space="sm">
        <FormControl isRequired>
          <FormControlLabel>
            <FormControlLabelText>Nombre del cliente</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField />
          </Input>
        </FormControl>
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Número de teléfono</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField />
          </Input>
        </FormControl>
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Correo electrónico</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField />
          </Input>
        </FormControl>
      </VStack>
      <Divider/>
      <FlatList
        data={DATA} 
        renderItem={({item}) => <ReceiptItem />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    gap: 16,
  },
});
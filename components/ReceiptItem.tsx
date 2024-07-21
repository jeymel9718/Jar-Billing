import { Dimensions, StyleSheet } from "react-native";
import { HStack } from "./ui/hstack";
import { Input, InputField } from "./ui/input";
import { Textarea, TextareaInput } from "./ui/textarea";
import { VStack } from "./ui/vstack";

const windowDimensions = Dimensions.get('window');

export default function ReceiptItem() {
  return (
    <VStack space="sm">
      <Input>
        <InputField placeholder="Cantidad" />
      </Input>
      <Input>
        <InputField placeholder="Producto/Descripción" />
      </Input>
      <HStack space="lg" className="w-full" >
        <Input style={styles.input}>
          <InputField placeholder="Total"/>
        </Input>
        <Input style={styles.input}>
          <InputField placeholder="Costo"/>
        </Input>
      </HStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  input: {
    width: windowDimensions.width*0.439
  }
});
import { validateEmail } from "@/utils/functions";
import { Dimensions, StyleSheet, View } from "react-native";
import { Button, Card, HelperText, TextInput } from "react-native-paper";

const windowDimensions = Dimensions.get("window");

const inputTheme = {
  roundness: 10,
};

export type ClientDetailsProps = {
  clientName: string;
  clientNumber: string;
  clientEmail: string;
  date: string;
  onClientNameChange: (v: string) => void;
  onClientNumberChange: (v: string) => void;
  onClientEmailChange: (v: string) => void;
  onDatePicker: () => void;
};

export function ClientDetails({
  clientName,
  clientNumber,
  clientEmail,
  date,
  onClientNameChange,
  onClientNumberChange,
  onClientEmailChange,
  onDatePicker,
}: ClientDetailsProps) {
  return (
    <Card style={styles.cardContainer}>
      <Card.Content style={styles.cardContent}>
        <TextInput
          mode="outlined"
          label="Nombre del cliente"
          theme={inputTheme}
          style={styles.button}
          value={clientName}
          onChangeText={onClientNameChange}
        />
        <TextInput
          mode="outlined"
          label="Número de teléfono"
          keyboardType="numeric"
          theme={inputTheme}
          style={styles.button}
          value={clientNumber}
          onChangeText={onClientNumberChange}
        />
        <View>
          <TextInput
            mode="outlined"
            label="Correo electrónico"
            error={!validateEmail(clientEmail)}
            theme={inputTheme}
            style={styles.button}
            value={clientEmail}
            onChangeText={onClientEmailChange}
          />
          <HelperText
            type="error"
            padding="none"
            visible={!validateEmail(clientEmail)}
          >
            Error: El correo electrónico no es valido.
          </HelperText>
        </View>
        <Button onPress={onDatePicker}>Fecha: {date}</Button>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 8,
  },
  button: {
    height: windowDimensions.height * 0.05,
  },
  cardContent: {
    gap: 6,
  },
});

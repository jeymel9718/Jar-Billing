import { Colors } from "@/constants/Colors";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { HeaderButtonProps } from "@react-navigation/native-stack/src/types";
import {
  Button,
  Dialog,
  Portal,
  RadioButton,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useState, useEffect, useMemo, useReducer, useRef, useCallback } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { ItemProps, Invoice } from "@/utils/types";
import { formatCurrency, generateHtml, validateEmail } from "@/utils/functions";
import { database } from "@/firebase/database";
import HeaderMenu from "@/components/HeaderMenu";
import { useDiscardChanges } from "@/hooks/useDiscardChanges";
import { useBill } from "@/hooks/useBill";
import { useBillItems } from "@/hooks/useBillItems";
import { ClientDetails } from "@/components/bill/ClientDetails";
import { BillItems } from "@/components/bill/BillItems";
import { BillTotal } from "@/components/bill/BillTotal";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

const windowDimensions = Dimensions.get("window");

type Reducer<T extends keyof Invoice> = {
  type: T;
  payload: Invoice[T];
};

function amountReducer<T extends keyof Invoice>(
  state: Invoice,
  action: Reducer<T>
) {
  switch (action.type) {
    case action.type:
      state[action.type] = action.payload;
      return { ...state };
    default:
      return { ...state };
  }
}

export default function PriceScreen() {
  const [date, setDate] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [discountVisible, setDiscountVisible] = useState(false);
  const [error, setError] = useState<string>("");
  const theme = useColorScheme() ?? "light";
  const { price } = useLocalSearchParams<{ price: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const db = database;
  const [state, dispatch] = useReducer(amountReducer, {
    discountType: "amount",
    discount: "0",
    subTotal: "0",
    total: "0",
    id: "",
    number: "",
    email: "",
    name: "",
    date: "",
    orderId: "",
  });

  const onChange = (event: any, selectedDate: any) => {
    setUnsaved(true);
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const getPercentageMount = () => {
    return parseFloat(state.subTotal) * (parseFloat(state.discount) / 100);
  };

  const total = useMemo(() => {
    let totalAmount: number;
    if (state.discountType === "amount") {
      totalAmount = parseInt(state.subTotal) - parseInt(state.discount);
    } else {
      totalAmount = parseInt(state.subTotal) - getPercentageMount();
    }
    if (totalAmount != parseFloat(state.total)) {
      setUnsaved(true);
    } else {
      setUnsaved(false);
    }

    return totalAmount;
  }, [state.subTotal, state.discount, state.discountType, state.total]);

  const showDatepicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: "date",
      is24Hour: true,
    });
  };

  useDiscardChanges(navigation, unsaved, state.id, {
    type: "price",
    key: price,
  });

  const priceRef = useBill(dispatch, price, setDate, "price");

  const itemsData = useBillItems(dispatch, "price", state.id);

  const dismissDialog = () => {
    setError("");
    setVisible(false);
  };

  const handleDiscountChange = (value: string) => {
    setUnsaved(true);
    value = value.replace(/\D+/g, "");
    if (parseInt(value) > 100 && state.discountType === "percent") {
      dispatch({ type: "discount", payload: "100" });
    } else {
      dispatch({ type: "discount", payload: value });
    }
  };

  const handleNumberChange = (value: string) => {
    setUnsaved(true);
    value = value.replace(/\D+/g, "");
    dispatch({ type: "number", payload: value.slice(0, 8) });
  };

  const handleNameChange = (value: string) => {
    setUnsaved(true);
    dispatch({ type: "name", payload: value });
  };

  const handleEmailChange = (value: string) => {
    setUnsaved(true);
    dispatch({ type: "email", payload: value });
  };

  const savePrice = () => {
    setLoading(true);
    setVisible(true);
    if (price === "new") {
      db.pushData(priceRef, {
        ...state,
        date: date.toLocaleDateString(),
        total: total.toString(),
      })
        .then(() => {
          setUnsaved(false);
          setLoading(false);
          dispatch({ type: "total", payload: total.toString() });
        })
        .catch(() => {
          setError("Hubo un error al guardar la cotización");
          setLoading(false);
        });
      db.incrementPrices();
    } else {
      db.updateData(`price/${price}`, {
        ...state,
        date: date.toLocaleDateString(),
        total: total.toString(),
      })
        .then(() => {
          setUnsaved(false);
          setLoading(false);
        })
        .catch(() => {
          setError("Hubo un error al guardar la cotización");
          setLoading(false);
        });
    }
  };

  const previewPrice = () => {
    router.navigate(`/price/preview/${price}`);
  };

  const sharePrice = useCallback(async () => {
    setSnackVisible(true);
    const html = generateHtml(state, itemsData);
    const { uri } = await printToFileAsync({ html });
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    setSnackVisible(false);
  }, [state, itemsData]);

  useEffect(() => {
    navigation.setOptions({
      title: state.orderId,
      headerRight: (props: HeaderButtonProps) => (
        <HeaderMenu
          headerProps={props}
          onSave={savePrice}
          onPreview={previewPrice}
          onShare={sharePrice}
        />
      ),
    });
  }, [navigation, state, unsaved, total, date, sharePrice]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors[theme].background }]}
    >
      <Portal>
        <Dialog visible={visible}>
          <Dialog.Title>Editar servicio</Dialog.Title>
          {loading && (
            <Dialog.Content>
              <Text variant="titleMedium">Guardando nuevos cambios...</Text>
              <ActivityIndicator animating={loading} size={"large"} />
            </Dialog.Content>
          )}
          {!loading && error === "" && (
            <Dialog.Content>
              <Text variant="titleMedium">Cambios guardados con éxito</Text>
            </Dialog.Content>
          )}
          {error !== "" && !loading && (
            <Dialog.Content>
              <Text variant="labelLarge">{error}</Text>
            </Dialog.Content>
          )}
          {!loading && (
            <Dialog.Actions>
              <Button onPress={() => dismissDialog()}>Aceptar</Button>
            </Dialog.Actions>
          )}
        </Dialog>
        <Dialog
          visible={discountVisible}
          onDismiss={() => setDiscountVisible(false)}
        >
          <Dialog.Title>Agregar descuento</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              value={state.discountType}
              onValueChange={(value) =>
                dispatch({ type: "discountType", payload: value })
              }
            >
              <RadioButton.Item label="Monto fijo" value="amount" />
              <RadioButton.Item label="Porcentaje" value="percent" />
              <TextInput
                value={state.discount}
                onChangeText={handleDiscountChange}
                label="Monto del descuento"
              />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDiscountVisible(false)}>Aceptar</Button>
          </Dialog.Actions>
        </Dialog>
        <Snackbar visible={snackVisible} onDismiss={() => {}}>Generando Cotización...</Snackbar>
      </Portal>
      <Text variant="titleLarge" style={styles.sectionText}>
        Detalles del cliente
      </Text>
      <ClientDetails
        clientName={state.name}
        clientNumber={state.number}
        clientEmail={state.email}
        date={date.toLocaleDateString()}
        onClientNameChange={handleNameChange}
        onClientNumberChange={handleNumberChange}
        onClientEmailChange={handleEmailChange}
        onDatePicker={showDatepicker}
      />
      <Text variant="titleLarge" style={[styles.sectionText, { marginTop: 7 }]}>
        Detalles de los servicios
      </Text>
      <BillItems items={itemsData} billKey="price" id={state.id} />
      <BillTotal
        total={total}
        subTotal={state.subTotal}
        discount={
          state.discountType == "amount"
            ? formatCurrency(state.discount)
            : formatCurrency(getPercentageMount())
        }
        onDiscountPress={() => setDiscountVisible(true)}
      />
      <View style={{ marginBottom: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
  },
  cardContainer: {
    marginHorizontal: 8,
  },
  sectionText: {
    opacity: 0.5,
    marginBottom: 7,
  },
  button: {
    height: windowDimensions.height * 0.05,
  },
  cardContent: {
    gap: 6,
  },
  textOpacity: {
    opacity: 0.35,
  },
  addItem: {
    position: "absolute",
    bottom: -31,
    right: windowDimensions.width * 0.25,
    borderRadius: 40,
    zIndex: 1,
  },
  inlineContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "space-between",
  },
});

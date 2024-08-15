import ReceiptItem from "@/components/ReceiptItem";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { HeaderButtonProps } from "@react-navigation/native-stack/src/types";
import {
  Button,
  Card,
  Chip,
  Dialog,
  Divider,
  HelperText,
  IconButton,
  Portal,
  RadioButton,
  Text,
  TextInput,
} from "react-native-paper";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useState, useEffect, useMemo, useReducer, useRef } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { ItemProps, Price } from "@/utils/types";
import { formatCurrency, validateEmail } from "@/utils/functions";
import { database } from "@/firebase/database";
import HeaderMenu from "@/components/HeaderMenu";

const windowDimensions = Dimensions.get("window");

const buttonTheme = {
  roundness: 10,
};

type Reducer<T extends keyof Price> = {
  type: T;
  payload: Price[T];
};

function amountReducer<T extends keyof Price>(
  state: Price,
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
  const [itemsData, setItemsData] = useState<ItemProps[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [priceRef, setPriceRef] = useState<any>();
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

  const formattedDate = useMemo(() => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const day = date.getDate();
    const formattedDate = `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
    return formattedDate;
  }, [date]);

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

  useEffect(() => {
    navigation.setOptions({
      title: state.orderId,
      headerRight: (props: HeaderButtonProps) => (
        <HeaderMenu
          headerProps={props}
          onSave={savePrice}
          onPreview={previewPrice}
          onShare={() => {}}
          visible={showMenu}
          onDismiss={() => setShowMenu(false)}
          anchor={<IconButton icon="dots-vertical" onPress={() => setShowMenu(true)}/>}
        />
      ),
    });
  }, [navigation, state, showMenu, unsaved, total, date]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!unsaved) {
        return;
      }

      const discardChanges = () => {
        if (price === "new") {
          db.deleteData(`price-items/${state.id}`).then(() => {
            navigation.dispatch(e.data.action);
          });
        } else {
          navigation.dispatch(e.data.action);
        }
      };

      e.preventDefault();
      Alert.alert(
        "Cambios sin guardar",
        "Existen cambios sin guardar. ¿Desea salir sin guardar los cambios?",
        [
          { text: "Seguir editando", style: "cancel", onPress: () => {} },
          {
            text: "Salir",
            style: "destructive",
            onPress: discardChanges,
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, state.id, unsaved]);

  useEffect(() => {
    if (price === "new") {
      const newRef = db.getNewRef("price");
      setPriceRef(newRef);
      dispatch({ type: "id", payload: newRef.key });
      db.readOnce("counters/prices")
        .then((snapshot) => {
          if (snapshot.exists()) {
            const orderId: number = snapshot.val();
            dispatch({ type: "orderId", payload: `${orderId + 1}` });
          }
        })
        .catch((error) => {
          console.info("Error:", error);
        });
    } else {
      db.readOnce(`price/${price}`).then((snapshot) => {
        if (snapshot.exists()) {
          const currentPrice: Price = snapshot.val();
          Object.keys(currentPrice).forEach((key) => {
            const priceKey = key as keyof Price;
            if (key === "date") {
              setDate(new Date(currentPrice[key]));
            } else {
              dispatch({ type: priceKey, payload: currentPrice[priceKey] });
            }
          });
        }
      });
    }
  }, [price]);

  useEffect(() => {
    if (state.id === "") {
      return;
    }

    const readReference = db.read(`price-items/${state.id}`, (snapshot) => {
      if (snapshot.exists()) {
        const data: ItemProps[] = [];
        let amount = 0;
        Object.values(snapshot.val()).forEach((child) => {
          const tmpItem = child as ItemProps;
          amount += parseInt(tmpItem.price);
          data.push(tmpItem);
        });
        setItemsData(data);
        dispatch({ type: "subTotal", payload: amount.toString() });
      } else {
        console.info("no snapshot");
      }
    });

    return () => db.stopRead(`price-items/${state.id}`, readReference);
  }, [state.id]);

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
        date: date.toDateString(),
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
        date: date.toDateString(),
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
    setShowMenu(false);
  };

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
      </Portal>
      <Text variant="titleLarge" style={styles.sectionText}>
        Detalles del cliente
      </Text>
      <Card style={styles.cardContainer}>
        <Card.Content style={styles.cardContent}>
          <TextInput
            mode="outlined"
            label="Nombre del cliente"
            theme={buttonTheme}
            style={styles.button}
            value={state.name}
            onChangeText={handleNameChange}
          />
          <TextInput
            mode="outlined"
            label="Número de teléfono"
            theme={buttonTheme}
            style={styles.button}
            value={state.number}
            onChangeText={handleNumberChange}
          />
          <View>
            <TextInput
              mode="outlined"
              label="Correo electrónico"
              error={!validateEmail(state.email)}
              theme={buttonTheme}
              style={styles.button}
              value={state.email}
              onChangeText={handleEmailChange}
            />
            <HelperText
              type="error"
              padding="none"
              visible={!validateEmail(state.email)}
            >
              Error: El correo electrónico no es valido.
            </HelperText>
          </View>
          <Button onPress={showDatepicker}>Fecha: {formattedDate}</Button>
        </Card.Content>
      </Card>
      <Text variant="titleLarge" style={[styles.sectionText, { marginTop: 7 }]}>
        Detalles de los servicios
      </Text>
      <Card
        style={{
          marginTop: 5,
          position: "relative",
          marginBottom: 20,
          paddingBottom: 15,
          marginHorizontal: 8,
        }}
      >
        {itemsData.map((item, index) => (
          <View key={index}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "space-between",
                padding: 10,
              }}
            >
              <Text variant="titleSmall">{item.description}</Text>
              <Text variant="titleSmall">{formatCurrency(item.price)}</Text>
            </View>
            <Divider />
          </View>
        ))}
        <Chip
          icon="plus"
          compact
          onPress={() => router.navigate(`/price/items/${state.id}`)}
          style={styles.addItem}
        >
          Añadir servicio
        </Chip>
      </Card>
      <Card style={styles.cardContainer}>
        <Card.Content style={{ position: "relative", gap: 2, zIndex: -1 }}>
          <View style={styles.inlineContainer}>
            <Text style={styles.textOpacity} variant="titleSmall">
              Sub total
            </Text>
            <Text variant="titleSmall">{formatCurrency(state.subTotal)}</Text>
          </View>
          <View style={[styles.inlineContainer, { marginBottom: 15 }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                gap: 5,
              }}
            >
              <Text variant="titleSmall" style={styles.textOpacity}>
                Descuento
              </Text>
              <Ionicons
                name="create-outline"
                size={20}
                color={Colors[theme].primary}
                onPress={() => setDiscountVisible(true)}
              />
            </View>
            <Text variant="titleSmall">
              -
              {state.discountType == "amount"
                ? formatCurrency(state.discount)
                : formatCurrency(getPercentageMount())}
            </Text>
          </View>
          <View
            style={[
              styles.inlineContainer,
              {
                backgroundColor: Colors[theme].secondaryContainer,
                position: "absolute",
                bottom: 0,
                left: 0,
                paddingHorizontal: 15,
                width: windowDimensions.width * 0.955,
                height: "48%",
                borderBottomEndRadius: 10,
                borderBottomStartRadius: 10,
              },
            ]}
          >
            <Text style={styles.textOpacity} variant="titleSmall">
              Total
            </Text>
            <Text variant="titleSmall">{formatCurrency(total)}</Text>
          </View>
        </Card.Content>
      </Card>
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

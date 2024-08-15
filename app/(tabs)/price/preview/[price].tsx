import { ThemedView } from "@/components/ThemedView";
import { database } from "@/firebase/database";
import { generateHtml } from "@/utils/functions";
import { ItemProps, Price } from "@/utils/types";
import { printToFileAsync } from "expo-print";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import WebView from "react-native-webview";

const windowDimensions = Dimensions.get("window");

export default function PreviewPriceScreen() {
  const { price } = useLocalSearchParams<{ price: string }>();
  const [currentPrice, setCurrentPrice] = useState<Price>({
    id: "",
    name: "",
    number: "",
    total: "",
    subTotal: "",
    discountType: "amount",
    discount: "",
    email: "",
    date: "",
    orderId: "",
  });
  const [priceItems, setPriceItems] = useState<ItemProps[]>([]);
  const db = database;

  useEffect(() => {
    db.readOnce(`price/${price}`)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setCurrentPrice(snapshot.val() as Price);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    db.readOnce(`price-items/${price}`)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data: ItemProps[] = [];
          snapshot.forEach((child) => {
            data.push(child.val() as ItemProps);
          });
          setPriceItems(data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [price]);

  const html = useMemo(() => {
    const html = generateHtml(currentPrice, priceItems);
    return html;
  }, [currentPrice, priceItems]);

  return (
    <ThemedView>
      <View style={styles.previewContainer}>
        <Icon source="receipt" size={40} />
        <Text variant="titleLarge">Vista previa de la cotización</Text>
        <Text variant="labelSmall">
          Puedes enviar la cotización a un cliente
        </Text>
      </View>
      {html && (
        <View style={styles.preview}>
          <WebView
            originWhitelist={["*"]}
            source={{ html: html }}
            style={styles.webView}
          />
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    gap: 2,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    width: windowDimensions.width,
    marginVertical: 6,
  },
  preview: {
    width: "100%",
    height: windowDimensions.height*0.7,
    marginVertical: 20,
  },
  webView: {
    flex: 1,
  },
});

import { ThemedView } from "@/components/ThemedView";
import { database } from "@/firebase/database";
import { generateHtml } from "@/utils/functions";
import { ItemProps, Invoice } from "@/utils/types";
import { printToFileAsync } from "expo-print";
import { useLocalSearchParams } from "expo-router";
import { shareAsync } from "expo-sharing";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Button, Icon, Text } from "react-native-paper";
import WebView from "react-native-webview";

const windowDimensions = Dimensions.get("window");

export default function PreviewPriceScreen() {
  const { invoice } = useLocalSearchParams<{ invoice: string }>();
  const [currentPrice, setCurrentPrice] = useState<Invoice>({
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
  const [pdfUri, setPdfUri] = useState<string>("");
  const db = database;

  useEffect(() => {
    db.readOnce(`invoice/${invoice}`)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setCurrentPrice(snapshot.val() as Invoice);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    db.readOnce(`invoice-items/${invoice}`)
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
  }, [invoice]);

  const html = useMemo(() => {
    const html = generateHtml(currentPrice, priceItems);
    return html;
  }, [currentPrice, priceItems]);

  const sharePdf = async () => {
    const { uri } = await printToFileAsync({ html });
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };

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
      <View style={styles.buttonContainer}>
        <Button mode="contained" icon="share-variant" onPress={() => sharePdf()} style={styles.button}>Compartir</Button>
      </View>
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
    marginVertical: 12,
  },
  preview: {
    width: "100%",
    height: windowDimensions.height*0.53,
    marginVertical: 20,
  },
  webView: {
    flex: 1,
  },
  button: {
    width: '70%'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  }
});

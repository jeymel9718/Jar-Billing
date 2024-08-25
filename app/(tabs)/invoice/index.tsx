import { ThemedView } from "@/components/ThemedView";
import { database } from "@/firebase/database";
import { Invoice } from "@/utils/types";
import { Link, useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { HeaderButtonProps } from "@react-navigation/native-stack/src/types";
import { Dimensions, FlatList, TextInput, useColorScheme, StyleSheet } from "react-native";
import { FAB, IconButton } from "react-native-paper";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import ListItem from "@/components/ListItem";

const windowDimensions = Dimensions.get("window");

export default function InvoiceListScreen() {
  const db = database;
  const navigation = useNavigation();
  const router = useRouter();
  const [search, onChangeSearch] = useState("");
  const [prices, setPrices] = useState<Invoice[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputWidth = useSharedValue(40);
  const theme = useColorScheme() ?? "light";

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(inputWidth.value, { duration: 300 }),
    };
  });

  const toggleSearchBar = () => {
    if (isExpanded) {
      inputWidth.value = 40;
    } else {
      inputWidth.value = windowDimensions.width * 0.89;
    }
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: (props: HeaderButtonProps) => (
        <IconButton icon="magnify" {...props} onPress={toggleSearchBar} />
      ),
    });
  }, [navigation, isExpanded]);

  useEffect(() => {
    const readReference = db.read("invoice", (snapshot) => {
      if (snapshot.exists()) {
        const data: Invoice[] = [];
        snapshot.forEach((child) => {
          data.push(child.val() as Invoice);
        });
        setPrices(data);
      }
    });

    return () => {
      db.stopRead("invoice", readReference);
    };
  }, []);

  const filteredPrices = useMemo(() => {
    if (search) {
      return prices.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      return prices;
    }
  }, [prices, search]);

  return (
    <ThemedView style={styles.container}>
      {isExpanded && (
        <Animated.View style={[styles.searchContainer, animatedStyle]}>
          <TextInput
            style={styles.input}
            value={search}
            onChangeText={onChangeSearch}
            placeholder="Buscar..."
            onBlur={toggleSearchBar}
            autoFocus={isExpanded}
          />
        </Animated.View>
      )}
      <FlatList
        data={filteredPrices}
        renderItem={({ item }) => <ListItem {...item} colorScheme={theme} isInvoice={true} onPress={() => router.navigate(`/invoice/${item.id}`)} />}
        keyExtractor={(item) => item.id}
      />
      <Link asChild href="/invoice/new-invoice">
        <FAB icon={"plus"} style={styles.fabAdd} size="medium" />
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    paddingVertical: 32,
    paddingHorizontal: 20,
    gap: 5,
  },
  fabAdd: {
    position: "absolute",
    borderRadius: 50,
    bottom: 6,
    right: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
});
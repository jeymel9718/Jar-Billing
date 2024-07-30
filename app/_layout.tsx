import {
  DarkTheme as DefaultDarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const light = {
  ...MD3LightTheme,
  colors: {
    ...Colors.light,
    elevation: {
      level0: "transparent",
      level1: "rgb(243, 246, 233)",
      level2: "rgb(237, 241, 226)",
      level3: "rgb(231, 237, 218)",
      level4: "rgb(229, 236, 216)",
      level5: "rgb(225, 233, 211)"
    },
  },
};
const dark = {
  ...MD3DarkTheme,
  colors: {
    ...Colors.dark,
    elevation: {
      level0: "transparent",
      level1: "rgb(33, 37, 28)",
      level2: "rgb(36, 43, 31)",
      level3: "rgb(40, 49, 33)",
      level4: "rgb(42, 50, 34)",
      level5: "rgb(44, 54, 35)"
    },
  },
};

const { LightTheme } = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme,
});
const { DarkTheme } = adaptNavigationTheme({
  reactNavigationDark: DefaultDarkTheme,
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <PaperProvider theme={colorScheme === "dark" ? dark : light}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : LightTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </PaperProvider>
    </GluestackUIProvider>
  );
}

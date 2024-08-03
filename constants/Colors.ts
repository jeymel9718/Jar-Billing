/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#33422A";
const tintColorDark = "#E7C18E";

export const Colors = {
  light: {
    primary: "rgb(43, 107, 40)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(173, 244, 161)",
    onPrimaryContainer: "rgb(0, 34, 2)",
    secondary: "rgb(149, 73, 7)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(255, 219, 199)",
    onSecondaryContainer: "rgb(49, 19, 0)",
    tertiary: "rgb(156, 65, 68)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(255, 218, 217)",
    onTertiaryContainer: "rgb(65, 0, 8)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(252, 253, 246)",
    onBackground: "rgb(26, 28, 25)",

    icon: "rgb(43, 107, 40)", // Dark Green
    tabIconDefault: "rgb(173, 244, 161)", // Olive Green
    tabIconSelected: "rgb(43, 107, 40)", // Dark Green

    tint: "rgb(43, 107, 40)", // Olive Green
    text: "#041D11", // Very Dark Green

    surface: "rgb(252, 253, 246)",
    onSurface: "rgb(26, 28, 25)",
    surfaceVariant: "rgb(222, 228, 216)",
    onSurfaceVariant: "rgb(66, 73, 63)",
    outline: "rgb(115, 121, 111)",
    outlineVariant: "rgb(194, 200, 188)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(47, 49, 45)",
    inverseOnSurface: "rgb(241, 241, 235)",
    inversePrimary: "rgb(146, 215, 135)",
    elevation: {
      level0: "transparent",
      level1: "rgb(242, 246, 236)",
      level2: "rgb(235, 241, 230)",
      level3: "rgb(229, 237, 223)",
      level4: "rgb(227, 236, 221)",
      level5: "rgb(223, 233, 217)"
    },
    surfaceDisabled: "rgba(26, 28, 25, 0.12)",
    onSurfaceDisabled: "rgba(26, 28, 25, 0.38)",
    backdrop: "rgba(44, 50, 42, 0.4)"
  },
  dark: {
    primary: "rgb(146, 215, 135)",
    onPrimary: "rgb(0, 58, 5)",
    primaryContainer: "rgb(14, 82, 18)",
    onPrimaryContainer: "rgb(173, 244, 161)",
    secondary: "rgb(255, 182, 136)",
    onSecondary: "rgb(81, 36, 0)",
    secondaryContainer: "rgb(115, 54, 0)",
    onSecondaryContainer: "rgb(255, 219, 199)",
    tertiary: "rgb(255, 179, 178)",
    onTertiary: "rgb(95, 19, 26)",
    tertiaryContainer: "rgb(126, 42, 46)",
    onTertiaryContainer: "rgb(255, 218, 217)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(26, 28, 25)",
    onBackground: "rgb(226, 227, 221)",

    icon: "rgb(146, 215, 135)", // Light Olive Green
    tabIconDefault: "rgb(14, 82, 18)", // Light Olive Green
    tabIconSelected: "rgb(146, 215, 135)", // Light Beige

    tint: "rgb(146, 215, 135)", // Light Olive Green
    text: "#EDEAD4", // Off-White

    surface: "rgb(26, 28, 25)",
    onSurface: "rgb(226, 227, 221)",
    surfaceVariant: "rgb(66, 73, 63)",
    onSurfaceVariant: "rgb(194, 200, 188)",
    outline: "rgb(140, 147, 136)",
    outlineVariant: "rgb(66, 73, 63)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(226, 227, 221)",
    inverseOnSurface: "rgb(47, 49, 45)",
    inversePrimary: "rgb(43, 107, 40)",
    elevation: {
      level0: "transparent",
      level1: "rgb(32, 37, 31)",
      level2: "rgb(36, 43, 34)",
      level3: "rgb(39, 49, 37)",
      level4: "rgb(40, 50, 38)",
      level5: "rgb(43, 54, 40)"
    },
    surfaceDisabled: "rgba(226, 227, 221, 0.12)",
    onSurfaceDisabled: "rgba(226, 227, 221, 0.38)",
    backdrop: "rgba(44, 50, 42, 0.4)"
  },
};

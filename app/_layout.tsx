import { Stack } from "expo-router";
import { ThemeProvider, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RecipeProvider } from "@/contexts/RecipeContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const navigationTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <SafeAreaProvider>
      <RecipeProvider>
        <ThemeProvider value={navigationTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="recipe" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </RecipeProvider>
    </SafeAreaProvider>
  );
}

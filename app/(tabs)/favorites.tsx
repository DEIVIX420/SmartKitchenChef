import Colors from "@/constants/colors";
import { useRecipe } from "@/contexts/RecipeContext";
import { Heart } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { favoriteRecipes, isLoading } = useRecipe();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}> 
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading your favorites...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Favorite Recipes
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {favoriteRecipes.length}{" "}
          {favoriteRecipes.length === 1 ? "recipe" : "recipes"} saved
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {favoriteRecipes.length === 0 ? (
          <View style={styles.emptyState}>
            <Heart size={64} color={colors.textSecondary} strokeWidth={1.5} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No favorites yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Start saving recipes you love by tapping the heart icon
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {favoriteRecipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                style={[
                  styles.recipeCard,
                  { backgroundColor: colors.cardBackground },
                ]}
                onPress={() => {
                  router.push({
                    pathname: "/recipe/detail" as any,
                    params: {
                      recipeData: encodeURIComponent(JSON.stringify(recipe))
                    },
                  });
                }}
                activeOpacity={0.7}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text
                      style={[styles.recipeTitle, { color: colors.text }]}
                      numberOfLines={2}
                    >
                      {recipe.title}
                    </Text>
                    <Heart
                      size={20}
                      color={colors.tint}
                      fill={colors.tint}
                      strokeWidth={2}
                    />
                  </View>

                  {recipe.description && (
                    <Text
                      style={[
                        styles.recipeDescription,
                        { color: colors.textSecondary },
                      ]}
                      numberOfLines={2}
                    >
                      {recipe.description}
                    </Text>
                  )}

                  <View style={styles.cardFooter}>
                    <View style={styles.metaItem}>
                      <Text
                        style={[
                          styles.metaText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        ⏱️ {recipe.prepTime + recipe.cookTime} min
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Text
                        style={[
                          styles.metaText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        🍽️ {recipe.servings} servings
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600" as const,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  grid: {
    gap: 16,
  },
  recipeCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    flex: 1,
    lineHeight: 24,
  },
  recipeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    gap: 16,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 13,
  },
});

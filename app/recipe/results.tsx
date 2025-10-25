import Colors from "@/constants/colors";
import { Recipe } from "@/types/recipe";
import { Clock, Users } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import AnimatedCard from "@/components/AnimatedCard";

export default function RecipeResultsScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const params = useLocalSearchParams();
  const router = useRouter();

  let recipes: Recipe[] = [];
  
  try {
    if (params.recipesData && typeof params.recipesData === 'string') {
      const decodedData = decodeURIComponent(params.recipesData);
      recipes = JSON.parse(decodedData);
    }
  } catch (error) {
    console.error('Error parsing recipes:', error);
    recipes = [];
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Recipe Suggestions",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}> 
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.heading, { color: colors.text }]}> 
            Found {recipes.length} recipes for you
          </Text>
          <Text style={[styles.subheading, { color: colors.textSecondary }]}> 
            AI-generated recipes based on your ingredients
          </Text>

          <View style={styles.recipeList}>
            {recipes.length === 0 ? (
              <View style={[styles.emptyState, { borderColor: colors.border }]}> 
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No recipes available</Text>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Try generating recipes again from the Discover tab.</Text>
              </View>
            ) : (
              recipes.map((recipe, index) => (
                <AnimatedCard key={recipe.id} delay={index * 100}>
                  <TouchableOpacity
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
                    <View style={styles.cardHeader}>
                      <View
                        style={[
                          styles.badge,
                          { backgroundColor: colors.tint + "20" },
                        ]}
                      >
                        <Text style={[styles.badgeText, { color: colors.tint }]}>#{index + 1}</Text>
                      </View>
                    </View>

                    <Text style={[styles.recipeTitle, { color: colors.text }]}>
                      {recipe.title}
                    </Text>

                    {recipe.description && (
                      <Text
                        style={[
                          styles.recipeDescription,
                          { color: colors.textSecondary },
                        ]}
                        numberOfLines={3}
                      >
                        {recipe.description}
                      </Text>
                    )}

                    <View style={styles.metaContainer}>
                      <View style={styles.metaItem}>
                        <Clock size={16} color={colors.textSecondary} />
                        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                          {recipe.prepTime + recipe.cookTime} min
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Users size={16} color={colors.textSecondary} />
                        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                          {recipe.servings} servings
                        </Text>
                      </View>
                    </View>

                    {recipe.nutrition && (
                      <View
                        style={[
                          styles.nutritionBar,
                          { backgroundColor: colors.border },
                        ]}
                      >
                        <Text
                          style={[
                            styles.nutritionText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {recipe.nutrition.calories} cal • {recipe.nutrition.protein}g protein • {recipe.nutrition.carbs}g carbs • {recipe.nutrition.fat}g fat
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </AnimatedCard>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700" as const,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
  },
  recipeList: {
    gap: 16,
  },
  emptyState: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  recipeCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    marginBottom: 8,
    lineHeight: 28,
  },
  recipeDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    fontWeight: "500" as const,
  },
  nutritionBar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  nutritionText: {
    fontSize: 12,
    fontWeight: "500" as const,
  },
});

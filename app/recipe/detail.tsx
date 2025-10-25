import Colors from "@/constants/colors";
import { useRecipe } from "@/contexts/RecipeContext";
import { Recipe } from "@/types/recipe";
import { Heart, Clock, Users, ChefHat } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";

export default function RecipeDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const params = useLocalSearchParams();
  const { toggleFavorite, isFavorite } = useRecipe();

  let recipe: Recipe | null = null;
  
  try {
    if (params.recipeData && typeof params.recipeData === 'string') {
      const decodedData = decodeURIComponent(params.recipeData);
      recipe = JSON.parse(decodedData);
    }
  } catch (error) {
    console.error('Error parsing recipe:', error);
    recipe = null;
  }

  if (!recipe) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          Recipe not found
        </Text>
      </View>
    );
  }

  const isRecipeFavorite = isFavorite(recipe.id);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: recipe.title,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => toggleFavorite(recipe)}
              style={styles.favoriteButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Heart
                size={24}
                color={colors.tint}
                fill={isRecipeFavorite ? colors.tint : "transparent"}
                strokeWidth={2}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            {recipe.title}
          </Text>

          {recipe.description && (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {recipe.description}
            </Text>
          )}

          <View style={styles.metaRow}>
            <View
              style={[styles.metaCard, { backgroundColor: colors.cardBackground }]}
            >
              <Clock size={20} color={colors.tint} />
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>
                Total Time
              </Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {recipe.prepTime + recipe.cookTime} min
              </Text>
            </View>

            <View
              style={[styles.metaCard, { backgroundColor: colors.cardBackground }]}
            >
              <Users size={20} color={colors.tint} />
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>
                Servings
              </Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {recipe.servings}
              </Text>
            </View>
          </View>

          {recipe.nutrition && (
            <View
              style={[
                styles.nutritionCard,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Nutrition per Serving
              </Text>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={[styles.nutritionValue, { color: colors.text }]}>
                    {recipe.nutrition.calories}
                  </Text>
                  <Text
                    style={[styles.nutritionLabel, { color: colors.textSecondary }]}
                  >
                    Calories
                  </Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={[styles.nutritionValue, { color: colors.text }]}>
                    {recipe.nutrition.protein}g
                  </Text>
                  <Text
                    style={[styles.nutritionLabel, { color: colors.textSecondary }]}
                  >
                    Protein
                  </Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={[styles.nutritionValue, { color: colors.text }]}>
                    {recipe.nutrition.carbs}g
                  </Text>
                  <Text
                    style={[styles.nutritionLabel, { color: colors.textSecondary }]}
                  >
                    Carbs
                  </Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={[styles.nutritionValue, { color: colors.text }]}>
                    {recipe.nutrition.fat}g
                  </Text>
                  <Text
                    style={[styles.nutritionLabel, { color: colors.textSecondary }]}
                  >
                    Fat
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ChefHat size={24} color={colors.tint} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Ingredients
              </Text>
            </View>
            <View
              style={[
                styles.ingredientsCard,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              {recipe.ingredients.map((ingredient, index) => (
                <View
                  key={index}
                  style={[
                    styles.ingredientItem,
                    { borderBottomColor: colors.border },
                    index === recipe.ingredients.length - 1 && {
                      borderBottomWidth: 0,
                    },
                  ]}
                >
                  <View style={[styles.bullet, { backgroundColor: colors.tint }]} />
                  <Text style={[styles.ingredientText, { color: colors.text }]}>
                    {ingredient.amount} {ingredient.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Instructions
              </Text>
            </View>
            <View style={styles.stepsList}>
              {recipe.steps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepNumber,
                      { backgroundColor: colors.tint + "20" },
                    ]}
                  >
                    <Text style={[styles.stepNumberText, { color: colors.tint }]}>
                      {index + 1}
                    </Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[styles.stepText, { color: colors.text }]}>
                      {step}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.bottomSpacing} />
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
  favoriteButton: {
    marginRight: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
    marginBottom: 12,
    lineHeight: 40,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  metaCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  metaLabel: {
    fontSize: 13,
  },
  metaValue: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  nutritionCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  nutritionGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  nutritionItem: {
    alignItems: "center",
    gap: 6,
  },
  nutritionValue: {
    fontSize: 22,
    fontWeight: "700" as const,
  },
  nutritionLabel: {
    fontSize: 12,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
  },
  ingredientsCard: {
    borderRadius: 16,
    padding: 16,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ingredientText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  stepsList: {
    gap: 20,
  },
  stepItem: {
    flexDirection: "row",
    gap: 16,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  stepContent: {
    flex: 1,
    paddingTop: 8,
  },
  stepText: {
    fontSize: 16,
    lineHeight: 24,
  },
  bottomSpacing: {
    height: 40,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 40,
  },
});

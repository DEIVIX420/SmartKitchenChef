import { useRecipe } from "@/contexts/RecipeContext";
import Colors from "@/constants/colors";
import {
  COMMON_INGREDIENTS,
  DISH_TYPES,
} from "@/constants/ingredients";
import { Plus, X, Search, Sparkles } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";
import { generateText } from "@/lib/ai";
import { Recipe } from "@/types/recipe";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DiscoverScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const {
    ingredients,
    addIngredient,
    removeIngredient,
    clearIngredients,
    dietaryPreferences,
    isLoading,
  } = useRecipe();
  const router = useRouter();

  const [inputValue, setInputValue] = useState("");
  const [selectedDishType, setSelectedDishType] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const filteredSuggestions = COMMON_INGREDIENTS.filter(
    (ing) =>
      ing.toLowerCase().includes(inputValue.toLowerCase()) &&
      !ingredients.some((i) => i.name.toLowerCase() === ing.toLowerCase())
  ).slice(0, 8);

  const handleAddIngredient = (name: string) => {
    if (name.trim()) {
      addIngredient(name.trim());
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0) {
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const ingredientList = ingredients.map((i) => i.name).join(", ");
      const dietaryInfo =
        dietaryPreferences.length > 0
          ? `\n- Dietary restrictions: ${dietaryPreferences.join(", ")}`
          : "";
      const selectedDish = selectedDishType
        ? DISH_TYPES.find((d) => d.id === selectedDishType)
        : undefined;
      const dishTypeInfo = selectedDish ? `\n- Dish type: ${selectedDish.label}` : "";

        const prompt = [
          `Generate exactly 3 unique recipe ideas using these ingredients: ${ingredientList}${dietaryInfo}${dishTypeInfo}`,
          "",
          "For each recipe, provide:",
          "1. Recipe title",
          "2. Brief description (1-2 sentences)",
          "3. Complete ingredients list with amounts",
          "4. Step-by-step cooking instructions",
          "5. Prep time (minutes)",
          "6. Cook time (minutes)",
          "7. Servings",
          "8. Estimated nutrition (calories, protein, carbs, fat in grams)",
          "",
          "IMPORTANT: Return ONLY a valid JSON array with no additional text before or after. Use this exact structure:",
          "[",
          "  {",
          "    \"title\": \"Recipe Name\",",
          "    \"description\": \"Brief description\",",
          "    \"ingredients\": [{\"name\": \"ingredient\", \"amount\": \"1 cup\"}],",
          "    \"steps\": [\"Step 1\", \"Step 2\"],",
          "    \"prepTime\": 15,",
          "    \"cookTime\": 30,",
          "    \"servings\": 4,",
          "    \"nutrition\": {\"calories\": 350, \"protein\": 25, \"carbs\": 40, \"fat\": 12}",
          "  }",
          "]",
        ].join("\n");

      console.log("Generating recipes with ingredients:", ingredientList);
      
      const response = await generateText({ 
        messages: [{ 
          role: "user", 
          content: prompt 
        }] 
      });
      
      console.log("AI Response received, type:", typeof response);
      console.log("AI Response length:", response?.length);
      console.log("AI Response preview:", response?.substring(0, 200));
      
      if (!response || typeof response !== 'string') {
        throw new Error('Invalid response from AI service');
      }
      
      let jsonStr = response.trim();
      
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```$/g, "").trim();
      } else if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/```\n?/g, "").replace(/```$/g, "").trim();
      }
      
      const jsonMatch = jsonStr.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        console.log("JSON array found, parsing...");
        const recipes = JSON.parse(jsonMatch[0]) as Recipe[];
        
        if (!recipes || recipes.length === 0) {
          throw new Error("No recipes returned from AI");
        }
        
        console.log(`Successfully parsed ${recipes.length} recipes`);
        
          const enhancedRecipes = recipes.map((recipe, index) => ({
            ...recipe,
            id: `${Date.now()}-${index}`,
            dishType: selectedDish?.label,
            dietaryInfo: dietaryPreferences.length > 0 ? dietaryPreferences : undefined,
            createdAt: Date.now(),
          }));

        router.push({
          pathname: "/recipe/results" as any,
          params: { 
            recipesData: encodeURIComponent(JSON.stringify(enhancedRecipes))
          },
        });
      } else {
        console.error("Could not find valid JSON in response:", jsonStr.substring(0, 500));
        throw new Error("Invalid response format from AI");
      }
    } catch (error) {
      console.error("Error generating recipes:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        
        let userMessage = "Failed to generate recipes. ";
        if (error.message.includes("Network request failed")) {
          userMessage += "Please check your internet connection and try again.";
        } else if (error.message.includes("JSON") || error.message.includes("parse")) {
          userMessage += "The AI returned an invalid response. Please try again.";
        } else {
          userMessage += error.message;
        }
        setErrorMessage(userMessage);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}> 
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading your pantry...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          What&apos;s in your kitchen?
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Add ingredients and discover amazing recipes
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your Ingredients
          </Text>

          <View
            style={[
              styles.inputContainer,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Add ingredient..."
              placeholderTextColor={colors.textSecondary}
              value={inputValue}
              onChangeText={(text) => {
                setInputValue(text);
                setShowSuggestions(text.length > 0);
              }}
              onSubmitEditing={() => handleAddIngredient(inputValue)}
              returnKeyType="done"
            />
            {inputValue.length > 0 && (
              <TouchableOpacity
                onPress={() => handleAddIngredient(inputValue)}
                style={[styles.addButton, { backgroundColor: colors.tint }]}
              >
                <Plus size={18} color="#FFFFFF" strokeWidth={3} />
              </TouchableOpacity>
            )}
          </View>

          {showSuggestions && filteredSuggestions.length > 0 && (
            <View
              style={[
                styles.suggestions,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              {filteredSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.suggestionItem,
                    { borderBottomColor: colors.border },
                    index === filteredSuggestions.length - 1 && {
                      borderBottomWidth: 0,
                    },
                  ]}
                  onPress={() => handleAddIngredient(suggestion)}
                >
                  <Text style={[styles.suggestionText, { color: colors.text }]}>
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.ingredientList}>
            {ingredients.map((ingredient) => (
              <View
                key={ingredient.id}
                style={[
                  styles.ingredientChip,
                  { backgroundColor: colors.cardBackground },
                ]}
              >
                <Text style={[styles.ingredientText, { color: colors.text }]}>
                  {ingredient.name}
                </Text>
                <TouchableOpacity
                  onPress={() => removeIngredient(ingredient.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={16} color={colors.textSecondary} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {ingredients.length > 0 && (
            <TouchableOpacity onPress={clearIngredients}>
              <Text style={[styles.clearText, { color: colors.tint }]}>
                Clear all
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Dish Type
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dishTypeScroll}
          >
            {DISH_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.dishTypeChip,
                  {
                    backgroundColor:
                      selectedDishType === type.id
                        ? colors.tint
                        : colors.cardBackground,
                  },
                ]}
                onPress={() =>
                  setSelectedDishType(
                    selectedDishType === type.id ? null : type.id
                  )
                }
                activeOpacity={0.7}
              >
                <Text style={styles.dishTypeEmoji}>{type.emoji}</Text>
                <Text
                  style={[
                    styles.dishTypeText,
                    {
                      color:
                        selectedDishType === type.id ? "#FFFFFF" : colors.text,
                    },
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={[
            styles.generateButton,
            {
              backgroundColor:
                ingredients.length > 0 && !isGenerating
                  ? colors.tint
                  : colors.border,
            },
          ]}
          onPress={handleGenerateRecipes}
          disabled={ingredients.length === 0 || isGenerating}
          activeOpacity={0.8}
        >
          {isGenerating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Sparkles size={24} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.generateButtonText}>Generate Recipes</Text>
            </>
          )}
        </TouchableOpacity>

        {ingredients.length === 0 && (
          <Text style={[styles.helpText, { color: colors.textSecondary }]}>
            Add at least one ingredient to start generating recipes
          </Text>
        )}

        {errorMessage && (
          <View
            style={[
              styles.errorContainer,
              { backgroundColor: `${colors.danger}20` },
            ]}
          >
            <Text style={[styles.errorText, { color: colors.danger }]}>
              {errorMessage}
            </Text>
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
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestions: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 15,
  },
  ingredientList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  ingredientChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  ingredientText: {
    fontSize: 15,
    fontWeight: "500" as const,
  },
  clearText: {
    fontSize: 15,
    fontWeight: "600" as const,
    marginTop: 12,
  },
  dishTypeScroll: {
    gap: 8,
  },
  dishTypeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dishTypeEmoji: {
    fontSize: 18,
  },
  dishTypeText: {
    fontSize: 15,
    fontWeight: "500" as const,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 8,
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600" as const,
  },
  helpText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
  },
  errorContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "500" as const,
  },
});

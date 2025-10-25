import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Recipe, UserIngredient } from "@/types/recipe";

const INGREDIENTS_STORAGE_KEY = "user_ingredients";
const FAVORITES_STORAGE_KEY = "favorite_recipes";
const DIETARY_PREFS_STORAGE_KEY = "dietary_preferences";

export const [RecipeProvider, useRecipe] = createContextHook(() => {
  const [ingredients, setIngredients] = useState<UserIngredient[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadStoredData = useCallback(async () => {
    try {
      const [storedIngredients, storedFavorites, storedPrefs] =
        await Promise.all([
          AsyncStorage.getItem(INGREDIENTS_STORAGE_KEY),
          AsyncStorage.getItem(FAVORITES_STORAGE_KEY),
          AsyncStorage.getItem(DIETARY_PREFS_STORAGE_KEY),
        ]);

      if (storedIngredients) {
        setIngredients(JSON.parse(storedIngredients));
      }
      if (storedFavorites) {
        setFavoriteRecipes(JSON.parse(storedFavorites));
      }
      if (storedPrefs) {
        setDietaryPreferences(JSON.parse(storedPrefs));
      }
    } catch (error) {
      console.error("Error loading stored data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredData();
  }, [loadStoredData]);

  const addIngredient = useCallback(async (name: string) => {
    const newIngredient: UserIngredient = {
      id: `${Date.now()}-${Math.random()}`,
      name,
      addedAt: Date.now(),
    };

    setIngredients((prev) => {
      const updated = [...prev, newIngredient];
      AsyncStorage.setItem(INGREDIENTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeIngredient = useCallback(async (id: string) => {
    setIngredients((prev) => {
      const updated = prev.filter((ing) => ing.id !== id);
      AsyncStorage.setItem(INGREDIENTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearIngredients = useCallback(async () => {
    setIngredients([]);
    await AsyncStorage.removeItem(INGREDIENTS_STORAGE_KEY);
  }, []);

  const toggleFavorite = useCallback(async (recipe: Recipe) => {
    setFavoriteRecipes((prev) => {
      const exists = prev.find((r) => r.id === recipe.id);
      const updated = exists
        ? prev.filter((r) => r.id !== recipe.id)
        : [...prev, { ...recipe, isFavorite: true }];

      AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (recipeId: string) => {
      return favoriteRecipes.some((r) => r.id === recipeId);
    },
    [favoriteRecipes]
  );

  const updateDietaryPreferences = useCallback(async (prefs: string[]) => {
    setDietaryPreferences(prefs);
    await AsyncStorage.setItem(DIETARY_PREFS_STORAGE_KEY, JSON.stringify(prefs));
  }, []);

  return useMemo(
    () => ({
      ingredients,
      addIngredient,
      removeIngredient,
      clearIngredients,
      favoriteRecipes,
      toggleFavorite,
      isFavorite,
      dietaryPreferences,
      updateDietaryPreferences,
      isLoading,
    }),
    [
      ingredients,
      favoriteRecipes,
      dietaryPreferences,
      isLoading,
      addIngredient,
      removeIngredient,
      clearIngredients,
      toggleFavorite,
      isFavorite,
      updateDietaryPreferences,
    ]
  );
});

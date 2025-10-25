export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  dishType?: string;
  dietaryInfo?: string[];
  nutrition?: NutritionInfo;
  imageUrl?: string;
  isFavorite?: boolean;
  createdAt: number;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  unit?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface UserIngredient {
  id: string;
  name: string;
  addedAt: number;
}

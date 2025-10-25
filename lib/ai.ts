const DEFAULT_INGREDIENTS = [
  "seasonal vegetables",
  "whole grains",
  "fresh herbs",
];

const PANTRY_INGREDIENTS = [
  { name: "olive oil", amount: "2 tbsp" },
  { name: "sea salt", amount: "1 tsp" },
  { name: "black pepper", amount: "1/2 tsp" },
];

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type GenerateTextParams = {
  messages: ChatMessage[];
};

type StructuredRecipe = {
  title: string;
  description: string;
  ingredients: { name: string; amount: string }[];
  steps: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

function extractList(source: string, marker: RegExp): string[] {
  const match = source.match(marker);
  if (!match || match.length < 2) {
    return [];
  }

  return match[1]
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normaliseIngredientName(value: string): string {
  if (!value) {
    return "Chef's choice";
  }

  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part, index) =>
      index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part
    )
    .join(" ");
}

function buildRecipe(
  index: number,
  ingredientPool: string[],
  dietaryNotes: string[],
  dishType?: string
): StructuredRecipe {
  const mainIngredient = ingredientPool[index % ingredientPool.length];
  const accentIngredient =
    ingredientPool[(index + 1) % ingredientPool.length] ?? DEFAULT_INGREDIENTS[0];

  const resolvedMain = normaliseIngredientName(mainIngredient);
  const resolvedAccent = normaliseIngredientName(accentIngredient);
  const courseLabel = dishType
    ? dishType.charAt(0).toUpperCase() + dishType.slice(1)
    : "Chef's Inspiration";

  const title = `${resolvedMain} ${courseLabel}${index === 0 ? "" : ` ${index + 1}`}`;
  const dietaryText =
    dietaryNotes.length > 0 ? ` (${dietaryNotes.join(", ")})` : "";

  const ingredients: StructuredRecipe["ingredients"] = [
    { name: resolvedMain, amount: "2 cups" },
    { name: resolvedAccent, amount: "1 cup" },
    ...PANTRY_INGREDIENTS,
  ];

  const steps: StructuredRecipe["steps"] = [
    `Prepare the ${resolvedMain.toLowerCase()} and ${resolvedAccent.toLowerCase()} by washing and chopping as needed.`,
    `Warm the olive oil in a pan over medium heat and sauté the ${resolvedMain.toLowerCase()} until fragrant.`,
    `Fold in the ${resolvedAccent.toLowerCase()} and season with salt and pepper, cooking until tender.`,
    `Finish by plating the dish and garnishing with fresh herbs to taste.`,
  ];

  const baseCalories = 280 + index * 40;

  return {
    title,
    description: `A vibrant ${courseLabel.toLowerCase()} featuring ${resolvedMain.toLowerCase()} and ${resolvedAccent.toLowerCase()}${dietaryText}.`,
    ingredients,
    steps,
    prepTime: 15 + index * 5,
    cookTime: 20 + index * 5,
    servings: 2 + index,
    nutrition: {
      calories: baseCalories,
      protein: 14 + index * 3,
      carbs: 32 + index * 4,
      fat: 10 + index * 2,
    },
  };
}

export async function generateText({ messages }: GenerateTextParams): Promise<string> {
  const latestMessage = messages[messages.length - 1]?.content ?? "";

  const ingredientList = extractList(
    latestMessage,
    /using these ingredients:\s*([^\n]+)/i
  );
  const dietaryPreferences = extractList(
    latestMessage,
    /Dietary restrictions:\s*([^\n]+)/i
  );
  const dishTypeMatch = latestMessage.match(/Dish type:\s*([^\n]+)/i);
  const dishType = dishTypeMatch?.[1]?.trim();

  const resolvedIngredients =
    ingredientList.length > 0 ? ingredientList : DEFAULT_INGREDIENTS;

  const recipes = Array.from({ length: 3 }, (_, index) =>
    buildRecipe(index, resolvedIngredients, dietaryPreferences, dishType)
  );

  return JSON.stringify(recipes);
}

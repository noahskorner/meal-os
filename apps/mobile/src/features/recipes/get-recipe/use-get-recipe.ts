import { webApiClient } from "@/lib/web-api-client";
import {
  getRecipe,
  type GetRecipeResponse,
  type GetRecipeStepResponse,
} from "@repo/web-api-client";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function getRecipeId(recipeId: string | string[] | undefined) {
  if (typeof recipeId === "string" && recipeId.trim().length > 0) {
    return recipeId;
  }

  return null;
}

function formatDuration(minutes: number | null) {
  if (!minutes) {
    return "Not set";
  }

  return `${minutes} min`;
}

function formatServings(servings: number | null) {
  if (!servings) {
    return "Not set";
  }

  return `${servings} servings`;
}

function formatTotalTime(prepTimeMinutes: number | null, cookTimeMinutes: number | null) {
  const totalMinutes = (prepTimeMinutes ?? 0) + (cookTimeMinutes ?? 0);

  if (!totalMinutes) {
    return "Not set";
  }

  return `${totalMinutes} min`;
}

function sortSteps(steps: GetRecipeStepResponse[]) {
  return [...steps].sort((left, right) => left.sortOrder - right.sortOrder);
}

function formatDetailValue(value: number | string | boolean | null | undefined) {
  if (value == null) {
    return "None";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();
    return trimmedValue.length > 0 ? trimmedValue : "None";
  }

  return `${value}`;
}

export function useGetRecipe() {
  const { recipeId: recipeIdParam } = useLocalSearchParams<{ recipeId?: string | string[] }>();
  const recipeId = getRecipeId(recipeIdParam);
  const [recipe, setRecipe] = useState<GetRecipeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const loadRecipe = useCallback(
    async (options?: { refresh?: boolean }) => {
      if (!recipeId) {
        if (!isMountedRef.current) {
          return;
        }

        setRecipe(null);
        setError("Recipe not found.");
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (options?.refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const { data, error: requestError } = await getRecipe({
          client: webApiClient,
          path: {
            recipeId,
          },
        });

        if (!isMountedRef.current) {
          return;
        }

        if (!data || requestError) {
          setRecipe(null);
          setError(requestError?.message ?? "Unable to load recipe.");
          return;
        }

        setRecipe(data);
        setError(null);
      } catch (requestError) {
        console.error("Error loading recipe:", requestError);

        if (isMountedRef.current) {
          setRecipe(null);
          setError("Unable to load recipe.");
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [recipeId],
  );

  useEffect(() => {
    void loadRecipe();
  }, [loadRecipe]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const recipeDetails = useMemo(() => {
    if (!recipe) {
      return null;
    }

    return {
      id: recipe.id,
      name: recipe.name,
      description: recipe.description?.trim() || "No description added.",
      servings: formatServings(recipe.servings),
      prepTime: formatDuration(recipe.prepTimeMinutes),
      cookTime: formatDuration(recipe.cookTimeMinutes),
      totalTime: formatTotalTime(recipe.prepTimeMinutes, recipe.cookTimeMinutes),
      ingredientCount: recipe.ingredients.length,
      stepCount: recipe.steps.length,
      ingredients: recipe.ingredients.map((ingredient) => ({
        ...ingredient,
        quantityLabel: formatDetailValue(ingredient.quantity),
        unitIdLabel: formatDetailValue(ingredient.unitId),
        ingredientIdLabel: formatDetailValue(ingredient.ingredientId),
        userIngredientIdLabel: formatDetailValue(ingredient.userIngredientId),
        preparationLabel: formatDetailValue(ingredient.preparation),
        noteLabel: formatDetailValue(ingredient.note),
        isOptionalLabel: formatDetailValue(ingredient.isOptional),
      })),
      steps: sortSteps(recipe.steps),
    };
  }, [recipe]);

  const refreshRecipe = useCallback(() => {
    void loadRecipe({ refresh: true });
  }, [loadRecipe]);

  return {
    recipeId,
    recipe,
    recipeDetails,
    isLoading,
    isRefreshing,
    error,
    refreshRecipe,
  };
}

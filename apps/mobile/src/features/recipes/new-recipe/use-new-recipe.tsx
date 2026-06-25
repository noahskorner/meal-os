import { createContext, useContext, useState, type ReactNode } from "react";
import {
  createRecipe,
  type CreateRecipeIngredientRequest,
  type CreateRecipeRequest,
  type CreateRecipeStepRequest,
} from "@repo/web-api-client";
import { webApiClient } from "@/lib/web-api-client";

type NewRecipeContextValue = {
  recipe: CreateRecipeRequest;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setPrepTime: (prepTime: number) => void;
  setCookTime: (cookTime: number) => void;
  setServings: (servings: number) => void;
  addIngredient: (ingredient: CreateRecipeIngredientRequest) => void;
  removeIngredient: (ingredientId: string) => void;
  clearIngredients: () => void;
  addStep: () => void;
  updateStep: (
    sortOrder: number,
    step: Partial<Omit<CreateRecipeStepRequest, "sortOrder">>,
  ) => void;
  reorderSteps: (steps: CreateRecipeStepRequest[]) => void;
  removeStep: (sortOrder: number) => void;
  clearSteps: () => void;
  resetDraft: () => void;
  save: () => Promise<void>;
};

const NewRecipeContext = createContext<NewRecipeContextValue | null>(null);

function createEmptyRecipe(): CreateRecipeRequest {
  return {
    name: "",
    description: "",
    prepTimeMinutes: 0,
    cookTimeMinutes: 0,
    servings: 0,
    recipeIngredients: [],
    recipeSteps: [],
  };
}

function normalizeSteps(steps: CreateRecipeStepRequest[]) {
  return steps.map((step, index) => ({
    ...step,
    sortOrder: index + 1,
  }));
}

export function NewRecipeProvider({ children }: { children: ReactNode }) {
  const [recipe, setRecipe] = useState<CreateRecipeRequest>(createEmptyRecipe);

  const setName = (name: string) => {
    setRecipe((prev) => ({ ...prev, name }));
  };

  const setDescription = (description: string) => {
    setRecipe((prev) => ({ ...prev, description }));
  };

  const setPrepTime = (prepTime: number) => {
    setRecipe((prev) => ({ ...prev, prepTimeMinutes: prepTime }));
  };

  const setCookTime = (cookTime: number) => {
    setRecipe((prev) => ({ ...prev, cookTimeMinutes: cookTime }));
  };

  const setServings = (servings: number) => {
    setRecipe((prev) => ({ ...prev, servings }));
  };

  const addIngredient = (ingredient: CreateRecipeIngredientRequest) => {
    setRecipe((prev) => ({
      ...prev,
      recipeIngredients: [
        ...(prev.recipeIngredients || []).filter(
          (item) => item.ingredientId !== ingredient.ingredientId,
        ),
        ingredient,
      ],
    }));
  };

  const removeIngredient = (ingredientId: string) => {
    setRecipe((prev) => ({
      ...prev,
      recipeIngredients: (prev.recipeIngredients || []).filter(
        (ingredient) => ingredient.ingredientId !== ingredientId,
      ),
    }));
  };

  const clearIngredients = () => {
    setRecipe((prev) => ({
      ...prev,
      recipeIngredients: [],
    }));
  };

  const addStep = () => {
    setRecipe((prev) => ({
      ...prev,
      recipeSteps: [
        ...(prev.recipeSteps || []),
        {
          text: "",
          sortOrder: (prev.recipeSteps || []).length + 1,
        },
      ],
    }));
  };

  const removeStep = (sortOrder: number) => {
    setRecipe((prev) => ({
      ...prev,
      recipeSteps: normalizeSteps(
        (prev.recipeSteps || []).filter((step) => step.sortOrder !== sortOrder),
      ),
    }));
  };

  const clearSteps = () => {
    setRecipe((prev) => ({
      ...prev,
      recipeSteps: [],
    }));
  };

  const updateStep = (
    sortOrder: number,
    step: Partial<Omit<CreateRecipeStepRequest, "sortOrder">>,
  ) => {
    setRecipe((prev) => ({
      ...prev,
      recipeSteps: (prev.recipeSteps || []).map((s) =>
        s.sortOrder === sortOrder ? { ...s, ...step } : s,
      ),
    }));
  };

  const reorderSteps = (steps: CreateRecipeStepRequest[]) => {
    setRecipe((prev) => ({
      ...prev,
      recipeSteps: normalizeSteps(steps),
    }));
  };

  const resetDraft = () => {
    setRecipe(createEmptyRecipe());
  };

  const save = async () => {
    const { error } = await createRecipe({
      client: webApiClient,
      body: {
        ...recipe,
        name: recipe.name.trim(),
        description: recipe.description?.trim(),
        recipeSteps: (recipe.recipeSteps || []).filter((step) =>
          step.text.trim(),
        ),
      },
    });

    if (error) {
      throw new Error("Unable to save recipe.");
    }
  };

  return (
    <NewRecipeContext.Provider
      value={{
        recipe,
        setName,
        setDescription,
        setPrepTime,
        setCookTime,
        setServings,
        addIngredient,
        removeIngredient,
        clearIngredients,
        addStep,
        removeStep,
        clearSteps,
        updateStep,
        reorderSteps,
        resetDraft,
        save,
      }}
    >
      {children}
    </NewRecipeContext.Provider>
  );
}

export function useNewRecipe() {
  const context = useContext(NewRecipeContext);

  if (!context) {
    throw new Error("useNewRecipe must be used within NewRecipeProvider.");
  }

  return context;
}

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { RecipeIngredient } from "./manual/ingredients/ingredient-data";

export type RecipeDetails = {
  name: string;
  description: string;
  servings: string;
  prepTime: string;
  cookTime: string;
  difficulty: string;
};

export type InstructionStep = {
  id: string;
  text: string;
  sortOrder: number;
};

type AddRecipeDraftContextValue = {
  details: RecipeDetails;
  recipeIngredients: RecipeIngredient[];
  instructions: InstructionStep[];
  notes: string;
  setDetail: (field: keyof RecipeDetails, value: string) => void;
  setRecipeIngredients: Dispatch<SetStateAction<RecipeIngredient[]>>;
  setInstructions: Dispatch<SetStateAction<InstructionStep[]>>;
  setNotes: (notes: string) => void;
  resetDraft: () => void;
};

const initialDetails: RecipeDetails = {
  name: "",
  description: "",
  servings: "",
  prepTime: "",
  cookTime: "",
  difficulty: "",
};

export const createInstructionStep = (
  text = "",
  sortOrder = 0,
): InstructionStep => ({
  id: Math.random().toString(36).substring(2, 9),
  text,
  sortOrder,
});

const initialInstructions = (): InstructionStep[] => [
  createInstructionStep(
    "Season both sides of the chicken with salt and pepper.",
    0,
  ),
  createInstructionStep(
    "Heat olive oil in a large skillet over medium-high heat.",
    1,
  ),
  createInstructionStep(
    "Add the chicken and cook for 6-7 minutes per side, until golden and cooked through.",
    2,
  ),
  createInstructionStep(
    "Add garlic and cook for 30 seconds until fragrant.",
    3,
  ),
  createInstructionStep(
    "Squeeze lemon juice over the chicken and garnish with fresh parsley. Serve warm.",
    4,
  ),
];

export const updateInstructionSortOrder = (steps: InstructionStep[]) =>
  steps.map((step, sortOrder) => ({ ...step, sortOrder }));

const NewRecipeContext = createContext<AddRecipeDraftContextValue | null>(null);

export function NewRecipeProvider({ children }: { children: ReactNode }) {
  const [details, setDetails] = useState<RecipeDetails>(initialDetails);
  const [recipeIngredients, setRecipeIngredients] = useState<
    RecipeIngredient[]
  >([]);
  const [instructions, setInstructions] =
    useState<InstructionStep[]>(initialInstructions);
  const [notes, setNotes] = useState("");

  const value = useMemo<AddRecipeDraftContextValue>(
    () => ({
      details,
      recipeIngredients,
      instructions,
      notes,
      setDetail: (field, value) => {
        setDetails((current) => ({ ...current, [field]: value }));
      },
      setRecipeIngredients,
      setInstructions,
      setNotes,
      resetDraft: () => {
        setDetails(initialDetails);
        setRecipeIngredients([]);
        setInstructions(initialInstructions());
        setNotes("");
      },
    }),
    [details, instructions, notes, recipeIngredients],
  );

  return (
    <NewRecipeContext.Provider value={value}>
      {children}
    </NewRecipeContext.Provider>
  );
}

export function useNewRecipe() {
  const context = useContext(NewRecipeContext);

  if (!context) {
    throw new Error("useNewRecipe must be used within AddRecipeDraftProvider.");
  }

  return context;
}

import {
  listIngredients,
  type ListIngredientResponse,
} from "@repo/web-api-client";

import { useIngredients } from "./use-ingredients";

export function useGlobalIngredients() {
  return useIngredients<ListIngredientResponse>({
    listIngredients,
  });
}

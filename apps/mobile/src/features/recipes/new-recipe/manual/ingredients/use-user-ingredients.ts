import {
  listUserIngredients,
  type ListUserIngredientResponse,
} from "@repo/web-api-client";

import { useIngredients } from "./use-ingredients";

export function useUserIngredients() {
  return useIngredients<ListUserIngredientResponse>({
    listIngredients: listUserIngredients,
  });
}

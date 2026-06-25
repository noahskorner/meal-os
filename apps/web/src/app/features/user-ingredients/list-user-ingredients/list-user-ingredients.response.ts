import type { PaginatedResponse } from "../../paginated.response";
import type { ListUserIngredientModel } from "./list-user-ingredients.model";

export type ListUserIngredientResponse = ListUserIngredientModel;

export type ListUserIngredientsResponse =
  PaginatedResponse<ListUserIngredientResponse>;

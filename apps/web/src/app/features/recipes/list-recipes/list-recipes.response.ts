import type { PaginatedResponse } from "../../paginated.response";
import type { ListRecipeModel } from "./list-recipes.model";

export type ListRecipeResponse = ListRecipeModel;

export type ListRecipesResponse = PaginatedResponse<ListRecipeResponse>;

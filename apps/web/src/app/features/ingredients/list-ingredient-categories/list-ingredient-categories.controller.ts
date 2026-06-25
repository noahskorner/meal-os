import {
  createListIngredientCategoriesResponseDto,
  type ListIngredientCategoriesResponseDto,
} from "./list-ingredient-categories.dto";
import { ListIngredientCategoriesFacade } from "./list-ingredient-categories.facade";

export type ListIngredientCategoriesResult = {
  status: 200;
  body: ListIngredientCategoriesResponseDto;
};

export class ListIngredientCategoriesController {
  constructor(
    private readonly listIngredientCategoriesFacade: ListIngredientCategoriesFacade,
  ) {}

  public async get(): Promise<ListIngredientCategoriesResult> {
    const categories = await this.listIngredientCategoriesFacade.list();

    return {
      status: 200,
      body: createListIngredientCategoriesResponseDto(categories),
    };
  }
}

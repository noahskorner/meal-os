import { ListIngredientCategoriesRepository } from "./list-ingredient-categories.repository";
import type { ListIngredientCategoriesResponse } from "./list-ingredient-categories.response";
import { ListIngredientCategoriesService } from "./list-ingredient-categories.service";

export class ListIngredientCategoriesFacade {
  constructor(
    private readonly listIngredientCategoriesService: ListIngredientCategoriesService,
    private readonly listIngredientCategoriesRepository: ListIngredientCategoriesRepository,
  ) {}

  public async list(): Promise<ListIngredientCategoriesResponse> {
    const categories = await this.listIngredientCategoriesRepository.findMany();

    return this.listIngredientCategoriesService.createListResponse(categories);
  }
}

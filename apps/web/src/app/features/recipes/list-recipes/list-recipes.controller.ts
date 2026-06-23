import type { AuthProvider } from "@/app/features/auth/auth-provider";
import {
  createListRecipesResponseDto,
  createListRecipesUnauthorizedResponseDto,
  type ListRecipesResponseDto,
  type ListRecipesUnauthorizedResponseDto,
} from "./list-recipes.dto";
import { ListRecipesFacade } from "./list-recipes.facade";

export type ListRecipesResult =
  | {
      status: 200;
      body: ListRecipesResponseDto;
    }
  | {
      status: 401;
      body: ListRecipesUnauthorizedResponseDto;
    };

export class ListRecipesController {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly listRecipesFacade: ListRecipesFacade,
  ) {}

  public async get(): Promise<ListRecipesResult> {
    const currentUser = await this.authProvider.getCurrentUser();

    if (!currentUser) {
      return {
        status: 401,
        body: createListRecipesUnauthorizedResponseDto(),
      };
    }

    const recipes = await this.listRecipesFacade.list({
      createdById: currentUser.id,
    });

    return {
      status: 200,
      body: createListRecipesResponseDto(recipes),
    };
  }
}

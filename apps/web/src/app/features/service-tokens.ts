import { createToken } from "@repo/dependency-injection";
import type { PrismaClient } from "@repo/db";
import type { AuthProvider } from "@/app/features/auth/auth-provider";
import type { HealthCheckController } from "@/app/features/health-check/health-check.controller";
import type { HealthCheckFacade } from "@/app/features/health-check/health-check.facade";
import type { HealthCheckService } from "@/app/features/health-check/health-check.service";
import type { ListIngredientsController } from "@/app/features/ingredients/list-ingredients/list-ingredients.controller";
import type { ListIngredientsFacade } from "@/app/features/ingredients/list-ingredients/list-ingredients.facade";
import type { ListIngredientsRepository } from "@/app/features/ingredients/list-ingredients/list-ingredients.repository";
import type { ListIngredientsService } from "@/app/features/ingredients/list-ingredients/list-ingredients.service";
import type { GetProfileController } from "@/app/features/profiles/get-profile/get-profile.controller";
import type { GetProfileFacade } from "@/app/features/profiles/get-profile/get-profile.facade";
import type { GetProfileRepository } from "@/app/features/profiles/get-profile/get-profile.repository";
import type { GetProfileService } from "@/app/features/profiles/get-profile/get-profile.service";
import type { CreateRecipeController } from "@/app/features/recipes/create-recipe/create-recipe.controller";
import type { CreateRecipeFacade } from "@/app/features/recipes/create-recipe/create-recipe.facade";
import type { CreateRecipeRepository } from "@/app/features/recipes/create-recipe/create-recipe.repository";
import type { CreateRecipeService } from "@/app/features/recipes/create-recipe/create-recipe.service";
import type { ListRecipesController } from "@/app/features/recipes/list-recipes/list-recipes.controller";
import type { ListRecipesFacade } from "@/app/features/recipes/list-recipes/list-recipes.facade";
import type { ListRecipesRepository } from "@/app/features/recipes/list-recipes/list-recipes.repository";
import type { ListRecipesService } from "@/app/features/recipes/list-recipes/list-recipes.service";
import type { GetRecipeController } from "@/app/features/recipes/get-recipe/get-recipe.controller";
import type { GetRecipeFacade } from "@/app/features/recipes/get-recipe/get-recipe.facade";
import type { GetRecipeRepository } from "@/app/features/recipes/get-recipe/get-recipe.repository";
import type { GetRecipeService } from "@/app/features/recipes/get-recipe/get-recipe.service";
import type { UpdateRecipeController } from "@/app/features/recipes/update-recipe/update-recipe.controller";
import type { UpdateRecipeFacade } from "@/app/features/recipes/update-recipe/update-recipe.facade";
import type { UpdateRecipeRepository } from "@/app/features/recipes/update-recipe/update-recipe.repository";
import type { UpdateRecipeService } from "@/app/features/recipes/update-recipe/update-recipe.service";
import type { CreateUserIngredientController } from "@/app/features/user-ingredients/create-user-ingredient/create-user-ingredient.controller";
import type { CreateUserIngredientFacade } from "@/app/features/user-ingredients/create-user-ingredient/create-user-ingredient.facade";
import type { CreateUserIngredientRepository } from "@/app/features/user-ingredients/create-user-ingredient/create-user-ingredient.repository";
import type { CreateUserIngredientService } from "@/app/features/user-ingredients/create-user-ingredient/create-user-ingredient.service";
import type { GetUserIngredientController } from "@/app/features/user-ingredients/get-user-ingredient/get-user-ingredient.controller";
import type { GetUserIngredientFacade } from "@/app/features/user-ingredients/get-user-ingredient/get-user-ingredient.facade";
import type { GetUserIngredientRepository } from "@/app/features/user-ingredients/get-user-ingredient/get-user-ingredient.repository";
import type { GetUserIngredientService } from "@/app/features/user-ingredients/get-user-ingredient/get-user-ingredient.service";
import type { ListUnitsController } from "@/app/features/units/list-units/list-units.controller";
import type { ListUnitsFacade } from "@/app/features/units/list-units/list-units.facade";
import type { ListUnitsRepository } from "@/app/features/units/list-units/list-units.repository";
import type { ListUnitsService } from "@/app/features/units/list-units/list-units.service";

export const SERVICE_TOKENS = {
  prisma: createToken<PrismaClient>("prisma"),
  authProvider: createToken<AuthProvider>("authProvider"),
  healthCheckService: createToken<HealthCheckService>("healthCheckService"),
  healthCheckFacade: createToken<HealthCheckFacade>("healthCheckFacade"),
  healthCheckController: createToken<HealthCheckController>(
    "healthCheckController",
  ),
  listIngredientsRepository: createToken<ListIngredientsRepository>(
    "listIngredientsRepository",
  ),
  listIngredientsService: createToken<ListIngredientsService>(
    "listIngredientsService",
  ),
  listIngredientsFacade: createToken<ListIngredientsFacade>(
    "listIngredientsFacade",
  ),
  listIngredientsController: createToken<ListIngredientsController>(
    "listIngredientsController",
  ),
  createUserIngredientRepository: createToken<CreateUserIngredientRepository>(
    "createUserIngredientRepository",
  ),
  createUserIngredientService: createToken<CreateUserIngredientService>(
    "createUserIngredientService",
  ),
  createUserIngredientFacade: createToken<CreateUserIngredientFacade>(
    "createUserIngredientFacade",
  ),
  createUserIngredientController: createToken<CreateUserIngredientController>(
    "createUserIngredientController",
  ),
  getUserIngredientRepository: createToken<GetUserIngredientRepository>(
    "getUserIngredientRepository",
  ),
  getUserIngredientService: createToken<GetUserIngredientService>(
    "getUserIngredientService",
  ),
  getUserIngredientFacade: createToken<GetUserIngredientFacade>(
    "getUserIngredientFacade",
  ),
  getUserIngredientController: createToken<GetUserIngredientController>(
    "getUserIngredientController",
  ),
  listUnitsRepository: createToken<ListUnitsRepository>("listUnitsRepository"),
  listUnitsService: createToken<ListUnitsService>("listUnitsService"),
  listUnitsFacade: createToken<ListUnitsFacade>("listUnitsFacade"),
  listUnitsController: createToken<ListUnitsController>("listUnitsController"),
  getProfileRepository: createToken<GetProfileRepository>(
    "getProfileRepository",
  ),
  getProfileService: createToken<GetProfileService>("getProfileService"),
  getProfileFacade: createToken<GetProfileFacade>("getProfileFacade"),
  getProfileController: createToken<GetProfileController>(
    "getProfileController",
  ),
  createRecipeRepository: createToken<CreateRecipeRepository>(
    "createRecipeRepository",
  ),
  createRecipeService: createToken<CreateRecipeService>("createRecipeService"),
  createRecipeFacade: createToken<CreateRecipeFacade>("createRecipeFacade"),
  createRecipeController: createToken<CreateRecipeController>(
    "createRecipeController",
  ),
  listRecipesRepository: createToken<ListRecipesRepository>(
    "listRecipesRepository",
  ),
  listRecipesService: createToken<ListRecipesService>("listRecipesService"),
  listRecipesFacade: createToken<ListRecipesFacade>("listRecipesFacade"),
  listRecipesController: createToken<ListRecipesController>(
    "listRecipesController",
  ),
  getRecipeRepository: createToken<GetRecipeRepository>("getRecipeRepository"),
  getRecipeService: createToken<GetRecipeService>("getRecipeService"),
  getRecipeFacade: createToken<GetRecipeFacade>("getRecipeFacade"),
  getRecipeController: createToken<GetRecipeController>("getRecipeController"),
  updateRecipeRepository: createToken<UpdateRecipeRepository>(
    "updateRecipeRepository",
  ),
  updateRecipeService: createToken<UpdateRecipeService>("updateRecipeService"),
  updateRecipeFacade: createToken<UpdateRecipeFacade>("updateRecipeFacade"),
  updateRecipeController: createToken<UpdateRecipeController>(
    "updateRecipeController",
  ),
} as const;

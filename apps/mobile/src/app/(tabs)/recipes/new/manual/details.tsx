import { DetailsScreen } from "@/features/recipes/new-recipe/manual/details/details-screen";
import { NewManualRecipeLayout } from "@/features/recipes/new-recipe/manual/new-manual-recipe-layout";
import { newRecipeRoutes } from "@/features/recipes/new-recipe/new-recipe-routes";

export default function ManualRecipeDetailsScreen() {
  return (
    <NewManualRecipeLayout
      backFallback={newRecipeRoutes.chooseMethod}
      nextLabel="Next: Ingredients"
      nextRoute={newRecipeRoutes.manualIngredients}
    >
      <DetailsScreen />
    </NewManualRecipeLayout>
  );
}

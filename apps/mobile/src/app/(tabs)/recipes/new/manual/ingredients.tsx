
import { IngredientsScreen } from "@/features/recipes/new-recipe/manual/ingredients/ingredients-screen";
import { NewManualRecipeLayout } from "@/features/recipes/new-recipe/manual/new-manual-recipe-layout";
import { newRecipeRoutes } from "@/features/recipes/new-recipe/new-recipe-routes";

export default function NewManualRecipeIngredientsRoute() {
  return (
    <NewManualRecipeLayout
      backRoute={newRecipeRoutes.manualDetails}
      nextLabel="Next: Steps"
      nextRoute={newRecipeRoutes.manualInstructions}
      scroll={false}
    >
      <IngredientsScreen />
    </NewManualRecipeLayout>
  );
}

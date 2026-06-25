import { InstructionsScreen } from "@/features/recipes/new-recipe/manual/instructions/instructions-screen";
import { NewManualRecipeLayout } from "@/features/recipes/new-recipe/manual/new-manual-recipe-layout";
import { newRecipeRoutes } from "@/features/recipes/new-recipe/new-recipe-routes";

export default function NewManualRecipeInstructionsRoute() {
  return (
    <NewManualRecipeLayout
      backRoute={newRecipeRoutes.manualIngredients}
      nextLabel="Next: Review"
      nextRoute={newRecipeRoutes.manualReview}
      scroll={false}
    >
      <InstructionsScreen />
    </NewManualRecipeLayout>
  );
}

import { NewManualRecipeLayout } from "@/features/recipes/new-recipe/manual/new-manual-recipe-layout";
import { ReviewScreen } from "@/features/recipes/new-recipe/manual/review/review-screen";
import { newRecipeRoutes } from "@/features/recipes/new-recipe/new-recipe-routes";

export default function NewManualRecipeReviewRoute() {
  return (
    <NewManualRecipeLayout
      backFallback={newRecipeRoutes.manualInstructions}
      nextLabel="Save Recipe"
    >
      <ReviewScreen />
    </NewManualRecipeLayout>
  );
}

import { MealPlanPlaceholderCard } from "./meal-plan-placeholder-card";
import { MealPlanStepTitle } from "./meal-plan-step-title";
import { NewMealPlanStepLayout } from "./new-meal-plan-step-layout";
import { newMealPlanRoutes } from "./new-meal-plan-routes";

export function MealPlanDetailsScreen() {
  return (
    <NewMealPlanStepLayout
      nextLabel="Next"
      nextRoute={newMealPlanRoutes.entries}
      backRoute={newMealPlanRoutes.start}
    >
      <MealPlanStepTitle
        title="Meal Plan Details"
        subtitle="Placeholder content for the initial setup step."
      />
      <MealPlanPlaceholderCard
        title="Details step"
        description="Use this screen to scaffold future fields like title, range, and planning preferences."
      />
    </NewMealPlanStepLayout>
  );
}

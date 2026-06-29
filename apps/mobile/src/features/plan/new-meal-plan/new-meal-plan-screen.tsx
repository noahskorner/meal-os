import { MealPlanPlaceholderCard } from "./meal-plan-placeholder-card";
import { MealPlanStepTitle } from "./meal-plan-step-title";
import { NewMealPlanStepLayout } from "./new-meal-plan-step-layout";
import { newMealPlanRoutes } from "./new-meal-plan-routes";

export function NewMealPlanScreen() {
  return (
    <NewMealPlanStepLayout
      nextLabel="Next"
      nextRoute={newMealPlanRoutes.details}
      backRoute={newMealPlanRoutes.plan}
    >
      <MealPlanStepTitle
        title="Create Meal Plan"
        subtitle="Start a new meal plan flow with placeholder steps."
      />
      <MealPlanPlaceholderCard
        title="Wizard entry point"
        description="This placeholder screen confirms `/plans/new` renders and can advance into the scaffolded flow."
      />
    </NewMealPlanStepLayout>
  );
}

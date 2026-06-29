import { router } from "expo-router";
import { MealPlanPlaceholderCard } from "./meal-plan-placeholder-card";
import { MealPlanStepTitle } from "./meal-plan-step-title";
import { NewMealPlanStepLayout } from "./new-meal-plan-step-layout";
import { newMealPlanRoutes } from "./new-meal-plan-routes";

export function MealPlanReviewScreen() {
  return (
    <NewMealPlanStepLayout
      nextLabel="Create Meal Plan"
      onNext={() => router.dismissTo(newMealPlanRoutes.plan)}
      backRoute={newMealPlanRoutes.entries}
    >
      <MealPlanStepTitle
        title="Review Meal Plan"
        subtitle="Final placeholder step before a future submit action."
      />
      <MealPlanPlaceholderCard
        title="Review step"
        description="This screen is intentionally static for now and only verifies the final route in the scaffolded wizard."
      />
    </NewMealPlanStepLayout>
  );
}

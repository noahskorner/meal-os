import { useLocalSearchParams } from "expo-router";
import { MealPlanPlaceholderCard } from "./meal-plan-placeholder-card";
import { MealPlanStepTitle } from "./meal-plan-step-title";
import { NewMealPlanStepLayout } from "./new-meal-plan-step-layout";
import { newMealPlanRoutes } from "./new-meal-plan-routes";

export function MealPlanEntryDateScreen() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const entryDate = date ?? "unknown-date";

  return (
    <NewMealPlanStepLayout
      nextLabel="Next"
      nextRoute={newMealPlanRoutes.review}
      backRoute={newMealPlanRoutes.entries}
    >
      <MealPlanStepTitle
        title={`Entry for ${entryDate}`}
        subtitle="Nested placeholder content for an individual planning day."
      />
      <MealPlanPlaceholderCard
        title="Daily entry child route"
        description={`This placeholder confirms the nested \`/plans/new/entries/${entryDate}\` screen renders as part of the entries flow.`}
      />
    </NewMealPlanStepLayout>
  );
}

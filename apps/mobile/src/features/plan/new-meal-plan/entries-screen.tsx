import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { MealPlanPlaceholderCard } from "./meal-plan-placeholder-card";
import { MealPlanStepTitle } from "./meal-plan-step-title";
import { NewMealPlanStepLayout } from "./new-meal-plan-step-layout";
import { newMealPlanRoutes } from "./new-meal-plan-routes";

const sampleEntryDate = "2026-07-01";

export function MealPlanEntriesScreen() {
  return (
    <NewMealPlanStepLayout
      nextLabel="Next"
      nextRoute={newMealPlanRoutes.review}
      backRoute={newMealPlanRoutes.details}
    >
      <MealPlanStepTitle
        title="Meal Plan Entries"
        subtitle="Placeholder content for the day-by-day planning step."
      />
      <MealPlanPlaceholderCard
        title="Entries step"
        description="This screen can host the meal plan calendar, grouped days, and entry list controls later."
      />
      <Button
        variant="brand-outline"
        onPress={() => router.push(newMealPlanRoutes.entryDate(sampleEntryDate))}
      >
        <Text>Open {sampleEntryDate} entry</Text>
      </Button>
    </NewMealPlanStepLayout>
  );
}

import { NewMealPlanLayout } from "@/features/plan/new-meal-plan/new-meal-plan-layout";
import { Stack } from "expo-router";

export default function NewMealPlanLayouts() {
  return (
    <NewMealPlanLayout>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </NewMealPlanLayout>
  );
}

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { TabPlaceholderScreen } from "@/components/tab-placeholder-screen";
import { newMealPlanRoutes } from "./new-meal-plan/new-meal-plan-routes";

export function PlanScreen() {
  return (
    <TabPlaceholderScreen
      eyebrow="Plan"
      title="Meal planning placeholder"
      description="Use this screen as the starting point for weekly planning, scheduling, and meal-building flows."
      footer={
        <Button variant="brand" onPress={() => router.push(newMealPlanRoutes.start)}>
          <Text>Create Meal Plan</Text>
        </Button>
      }
    />
  );
}

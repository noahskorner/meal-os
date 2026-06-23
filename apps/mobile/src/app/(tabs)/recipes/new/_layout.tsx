import { NewRecipeLayout } from "@/features/recipes/new-recipe/new-recipe-layout";
import { Stack } from "expo-router";

export default function NewRecipeLayouts() {
  return (
    <NewRecipeLayout>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </NewRecipeLayout>
  );
}

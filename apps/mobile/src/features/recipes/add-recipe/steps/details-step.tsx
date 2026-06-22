import { View } from "react-native";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StepTitle } from "./step-title";

export function DetailsStep() {
  return (
    <View className="gap-5">
      <StepTitle
        title="Recipe Details"
        subtitle="Let's start with the basics."
      />
      <RecipeDetailsForm />
    </View>
  );
}

export function RecipeDetailsForm() {
  return (
    <View className="gap-5">
      <View className="gap-2">
        <Label nativeID="recipe-name">
          Recipe Name
        </Label>
        <Input
          aria-labelledby="recipe-name"
          placeholder="e.g. Lemon Garlic Chicken"
          className="bg-background"
        />
      </View>

      <View className="gap-2">
        <Label nativeID="description">Description</Label>
        <Textarea
          aria-labelledby="description"
          placeholder="A short description of your recipe..."
          className="min-h-24 bg-background"
        />
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 gap-2">
          <Label nativeID="servings">Servings</Label>
          <Input
            aria-labelledby="servings"
            keyboardType="number-pad"
            placeholder="4"
            className="bg-background"
          />
        </View>

        <View className="flex-1 gap-2">
          <Label nativeID="prep-time">Prep Time</Label>
          <Input
            aria-labelledby="prep-time"
            placeholder="30 min"
            className="bg-background"
          />
        </View>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 gap-2">
          <Label nativeID="cook-time">Cook Time</Label>
          <Input
            aria-labelledby="cook-time"
            placeholder="30 min"
            className="bg-background"
          />
        </View>

        <View className="flex-1 gap-2">
          <Label nativeID="difficulty">Difficulty</Label>
          <Input
            aria-labelledby="difficulty"
            placeholder="Easy"
            className="bg-background"
          />
        </View>
      </View>
    </View>
  );
}

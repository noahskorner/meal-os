import { View } from "react-native";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNewRecipe } from "../../use-new-recipe";
import { StepTitle } from "../step-title";

export function DetailsScreen() {
  const { details, setDetail } = useNewRecipe();

  return (
    <View className="gap-5">
      <StepTitle
        title="Recipe Details"
        subtitle="Let's start with the basics."
      />
      <View className="gap-5">
        <View className="gap-2">
          <Label nativeID="recipe-name">Recipe Name</Label>
          <Input
            aria-labelledby="recipe-name"
            value={details.name}
            onChangeText={(value) => setDetail("name", value)}
            placeholder="e.g. Lemon Garlic Chicken"
            className="bg-background"
          />
        </View>

        <View className="gap-2">
          <Label nativeID="description">Description</Label>
          <Textarea
            aria-labelledby="description"
            value={details.description}
            onChangeText={(value) => setDetail("description", value)}
            placeholder="A short description of your recipe..."
            scrollEnabled={false}
            className="h-auto min-h-24 bg-background"
          />
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 gap-2">
            <Label nativeID="servings">Servings</Label>
            <Input
              aria-labelledby="servings"
              value={details.servings}
              onChangeText={(value) => setDetail("servings", value)}
              keyboardType="number-pad"
              placeholder="4"
              className="bg-background"
            />
          </View>

          <View className="flex-1 gap-2">
            <Label nativeID="prep-time">Prep Time</Label>
            <Input
              aria-labelledby="prep-time"
              value={details.prepTime}
              onChangeText={(value) => setDetail("prepTime", value)}
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
              value={details.cookTime}
              onChangeText={(value) => setDetail("cookTime", value)}
              placeholder="30 min"
              className="bg-background"
            />
          </View>

          <View className="flex-1 gap-2">
            <Label nativeID="difficulty">Difficulty</Label>
            <Input
              aria-labelledby="difficulty"
              value={details.difficulty}
              onChangeText={(value) => setDetail("difficulty", value)}
              placeholder="Easy"
              className="bg-background"
            />
          </View>
        </View>
      </View>{" "}
    </View>
  );
}

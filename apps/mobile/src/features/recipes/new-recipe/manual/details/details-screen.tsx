import { View } from "react-native";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNewRecipe } from "../../use-new-recipe";
import { StepTitle } from "../step-title";

export function DetailsScreen() {
  const {
    recipe,
    setName,
    setDescription,
    setPrepTime,
    setCookTime,
    setServings,
  } = useNewRecipe();

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
            value={recipe.name}
            onChangeText={setName}
            placeholder="e.g. Lemon Garlic Chicken"
            className="bg-background"
          />
        </View>

        <View className="gap-2">
          <Label nativeID="description">Description</Label>
          <Textarea
            aria-labelledby="description"
            value={recipe.description}
            onChangeText={setDescription}
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
              keyboardType="number-pad"
              value={recipe.servings?.toString()}
              onChangeText={(value) => setServings(Number(value))}
              placeholder="4"
              className="bg-background"
            />
          </View>

          <View className="flex-1 gap-2">
            <Label nativeID="prep-time">Prep Time</Label>
            <Input
              aria-labelledby="prep-time"
              keyboardType="number-pad"
              value={recipe.prepTimeMinutes?.toString()}
              onChangeText={(value) => setPrepTime(Number(value))}
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
              keyboardType="number-pad"
              value={recipe.cookTimeMinutes?.toString()}
              onChangeText={(value) => setCookTime(Number(value))}
              placeholder="30 min"
              className="bg-background"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

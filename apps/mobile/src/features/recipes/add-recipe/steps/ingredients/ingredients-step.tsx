import { StepTitle } from "../step-title";
import { Pressable, ScrollView, View } from "react-native";
import { Search, X } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useMemo, useState } from "react";
import {
  createIngredient,
  ingredients,
  updateSortOrder,
} from "./ingredient-data";
import { Ingredient, RecipeIngredient } from "./ingredient-types";
import { IngredientResult } from "./ingredient-result";
import { RecipeIngredientRow } from "./recipe-ingredient-row";

export function IngredientsStep() {
  const [query, setQuery] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState<
    RecipeIngredient[]
  >([
    { ...ingredients[0], sortOrder: 0 },
    { ...ingredients[2], sortOrder: 1 },
  ]);

  const addedIds = useMemo(
    () => new Set(recipeIngredients.map((ingredient) => ingredient.id)),
    [recipeIngredients],
  );

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return ingredients.filter((ingredient) => !addedIds.has(ingredient.id));
    }

    return ingredients.filter(
      (ingredient) =>
        !addedIds.has(ingredient.id) &&
        ingredient.name.toLowerCase().includes(normalizedQuery),
    );
  }, [addedIds, query]);

  const hasExactMatch = ingredients.some(
    (ingredient) => ingredient.name.toLowerCase() === query.trim().toLowerCase(),
  );

  const addIngredient = (ingredient: Ingredient) => {
    setRecipeIngredients((current) =>
      updateSortOrder([...current, { ...ingredient, sortOrder: current.length }]),
    );
  };

  const createNewIngredient = () => {
    const name = query.trim();

    if (!name) {
      return;
    }

    addIngredient(createIngredient(name));
    setQuery("");
  };

  const removeIngredient = (id: string) => {
    setRecipeIngredients((current) =>
      updateSortOrder(current.filter((ingredient) => ingredient.id !== id)),
    );
  };

  const clearIngredients = () => {
    setRecipeIngredients([]);
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: 24,
      }}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
    >
      <View className="gap-5">
        <View className="mb-5 gap-5">
          <StepTitle
            title="Ingredients"
            subtitle="Search and add everything for this recipe."
          />

          <View className="gap-2">
            <View className="relative">
              <Input
                value={query}
                onChangeText={setQuery}
                placeholder="Search ingredients"
                className="bg-background pl-10 pr-10"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View className="absolute left-3 top-2.5">
                <Icon as={Search} size={18} className="text-muted-foreground" />
              </View>
              {query ? (
                <Pressable
                  className="absolute right-3 top-2.5"
                  onPress={() => setQuery("")}
                  hitSlop={8}
                >
                  <Icon as={X} size={18} className="text-muted-foreground" />
                </Pressable>
              ) : null}
            </View>
          </View>

          {recipeIngredients.length > 0 ? (
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-foreground">
                Added ({recipeIngredients.length})
              </Text>
              <Pressable onPress={clearIngredients} hitSlop={8}>
                <Text className="text-xs font-medium text-brand">
                  Clear All
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        {recipeIngredients.length > 0 ? (
          <View className="gap-3">
            {recipeIngredients.map((ingredient) => (
              <RecipeIngredientRow
                key={ingredient.id}
                ingredient={ingredient}
                onRemove={() => removeIngredient(ingredient.id)}
              />
            ))}
          </View>
        ) : null}

        <View className="mt-5 gap-5">
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">
              Search Results
            </Text>

            {results.length > 0 ? (
              <View className="gap-2">
                {results.map((ingredient) => (
                  <IngredientResult
                    key={ingredient.id}
                    ingredient={ingredient}
                    onAdd={() => addIngredient(ingredient)}
                  />
                ))}
              </View>
            ) : (
              <Card className="items-center gap-2 rounded-xl border border-border bg-card p-5">
                <Text className="text-sm font-semibold text-foreground">
                  No ingredients found
                </Text>
                <Text className="text-center text-xs text-muted-foreground">
                  Create a new ingredient to add it to your recipe.
                </Text>
              </Card>
            )}
          </View>

          {query.trim() && !hasExactMatch ? (
            <Button
              variant="ghost"
              size="sm"
              onPress={createNewIngredient}
            >
              <Text className="font-medium text-brand">
                Create &apos;{query.trim()}&apos;
              </Text>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" disabled>
              <Text className="font-medium text-muted-foreground">
                Create New Ingredient
              </Text>
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

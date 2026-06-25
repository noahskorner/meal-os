import { StepTitle } from "../step-title";
import { Keyboard, Pressable, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/search-input";
import { Text } from "@/components/ui/text";
import { EditRecipeIngredientBottomSheet } from "./edit-recipe-ingredient-bottom-sheet";
import { IngredientResult } from "./ingredient-result";
import { RecipeIngredientRow } from "./recipe-ingredient-row";
import { useGlobalIngredients } from "./use-global-ingredients";
import { useNewRecipe } from "../../use-new-recipe";
import type {
  CreateRecipeIngredientRequest,
  ListIngredientResponse,
} from "@repo/web-api-client";
import * as React from "react";

function getIngredientReferenceKey(
  ingredient: Pick<
    CreateRecipeIngredientRequest,
    "ingredientId" | "userIngredientId" | "name"
  >,
) {
  return ingredient.ingredientId ?? ingredient.userIngredientId ?? ingredient.name;
}

export function IngredientsScreen() {
  const editIngredientSheetRef =
    React.useRef<React.ElementRef<typeof EditRecipeIngredientBottomSheet>>(null);
  const [editingIngredient, setEditingIngredient] =
    React.useState<CreateRecipeIngredientRequest | null>(null);
  const {
    query,
    ingredients,
    isLoading,
    error,
    hasExactMatch,
    searchIngredients,
    clearIngredients,
  } = useGlobalIngredients();
  const {
    recipe,
    addIngredient,
    updateIngredient,
    removeIngredient,
    clearIngredients: clearRecipeIngredients,
  } = useNewRecipe();

  const recipeIngredients = recipe.recipeIngredients || [];
  const addRecipeIngredient = (ingredient: ListIngredientResponse) => {
    addIngredient({
      ingredientId: ingredient.id,
      name: ingredient.name,
      quantity: 1,
      unitId: ingredient.defaultUnit.id,
    });
  };

  return (
    <>
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
        <View className="gap-3">
          <StepTitle
            title="Ingredients"
            subtitle="Search and add everything for this recipe."
          />

          <View className="gap-2">
            <SearchInput
              value={query}
              onChangeText={searchIngredients}
              onClear={clearIngredients}
              placeholder="Search ingredients"
              inputClassName="bg-background"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View className="gap-3">
            {recipeIngredients.length > 0 ? (
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-foreground">
                  Added ({recipeIngredients.length})
                </Text>
                <Pressable onPress={clearRecipeIngredients} hitSlop={8}>
                  <Text className="text-xs font-medium text-brand">
                    Clear All
                  </Text>
                </Pressable>
              </View>
            ) : null}
            {recipeIngredients.length > 0 ? (
              <View className="gap-3">
                {recipeIngredients.map((ingredient) => {
                  const ingredientKey = getIngredientReferenceKey(ingredient);

                  return (
                    <RecipeIngredientRow
                      key={ingredientKey}
                      ingredient={ingredient}
                      onEditAmount={() => {
                        Keyboard.dismiss();
                        setEditingIngredient(ingredient);
                        requestAnimationFrame(() => {
                          editIngredientSheetRef.current?.present();
                        });
                      }}
                      onRemove={() => removeIngredient(ingredientKey)}
                    />
                  );
                })}
              </View>
            ) : null}
          </View>

          <View className="gap-5">
            <View className="gap-3">
              <Text className="text-sm font-semibold text-foreground">
                Search Results
              </Text>

              {isLoading ? (
                <Card className="items-center gap-2 rounded-xl border border-border bg-card p-5">
                  <Text className="text-sm font-semibold text-foreground">
                    Loading ingredients
                  </Text>
                </Card>
              ) : error ? (
                <Card className="items-center gap-2 rounded-xl border border-border bg-card p-5">
                  <Text className="text-sm font-semibold text-foreground">
                    {error}
                  </Text>
                </Card>
              ) : ingredients.length > 0 ? (
                <View className="gap-2">
                  {ingredients.map((ingredient) => (
                    <IngredientResult
                      key={ingredient.id}
                      ingredient={ingredient}
                      onAdd={() => addRecipeIngredient(ingredient)}
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
              <Button variant="ghost" size="sm">
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

      <EditRecipeIngredientBottomSheet
        ref={editIngredientSheetRef}
        ingredient={editingIngredient}
        onDismiss={() => {
          editIngredientSheetRef.current?.dismiss();
          setEditingIngredient(null);
        }}
        onSave={(ingredient) => {
          if (!editingIngredient) {
            return;
          }

          updateIngredient(getIngredientReferenceKey(editingIngredient), ingredient);
          editIngredientSheetRef.current?.dismiss();
          setEditingIngredient(null);
        }}
      />
    </>
  );
}

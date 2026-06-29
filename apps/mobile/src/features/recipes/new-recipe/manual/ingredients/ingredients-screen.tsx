import { StepTitle } from "../step-title";
import { Keyboard, Pressable, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { Text } from "@/components/ui/text";
import { CreateUserIngredientBottomSheet } from "./create-user-ingredient-bottom-sheet";
import { EditRecipeIngredientBottomSheet } from "./edit-recipe-ingredient-bottom-sheet";
import { GlobalIngredientsList } from "./global-ingredients-list";
import { RecipeIngredientRow } from "./recipe-ingredient-row";
import { UserIngredientsList } from "./user-ingredients-list";
import { useGlobalIngredients } from "./use-global-ingredients";
import { useUserIngredients } from "./use-user-ingredients";
import { useNewRecipe } from "../../use-new-recipe";
import type {
  CreateRecipeIngredientRequest,
  ListIngredientResponse,
  ListUserIngredientResponse,
} from "@repo/web-api-client";
import * as React from "react";

function getIngredientReferenceKey(
  ingredient: Pick<
    CreateRecipeIngredientRequest,
    "ingredientId" | "userIngredientId" | "name"
  >,
) {
  return (
    ingredient.ingredientId ?? ingredient.userIngredientId ?? ingredient.name
  );
}

export function IngredientsScreen() {
  const editIngredientSheetRef =
    React.useRef<React.ElementRef<typeof EditRecipeIngredientBottomSheet>>(
      null,
    );
  const createIngredientSheetRef =
    React.useRef<React.ElementRef<typeof CreateUserIngredientBottomSheet>>(
      null,
    );
  const [editingIngredient, setEditingIngredient] =
    React.useState<CreateRecipeIngredientRequest | null>(null);
  const [creatingIngredientName, setCreatingIngredientName] =
    React.useState("");
  const globalIngredients = useGlobalIngredients();
  const userIngredients = useUserIngredients();
  const {
    recipe,
    addIngredient,
    updateIngredient,
    removeIngredient,
    clearIngredients: clearRecipeIngredients,
  } = useNewRecipe();

  const recipeIngredients = recipe.recipeIngredients || [];
  const query = globalIngredients.query;
  const hasExactMatch =
    globalIngredients.hasExactMatch || userIngredients.hasExactMatch;
  const addRecipeIngredient = (ingredient: ListIngredientResponse) => {
    addIngredient({
      ingredientId: ingredient.id,
      name: ingredient.name,
      quantity: 1,
      unitId: ingredient.defaultUnit.id,
    });
  };
  const addUserRecipeIngredient = (ingredient: ListUserIngredientResponse) => {
    addIngredient({
      userIngredientId: ingredient.id,
      name: ingredient.name,
      quantity: 1,
      ...(ingredient.defaultUnit ? { unitId: ingredient.defaultUnit.id } : {}),
    });
  };
  const searchIngredients = (searchTerm: string) => {
    globalIngredients.searchIngredients(searchTerm);
    userIngredients.searchIngredients(searchTerm);
  };
  const clearIngredients = () => {
    globalIngredients.clearIngredients();
    userIngredients.clearIngredients();
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
            <GlobalIngredientsList
              ingredients={globalIngredients.ingredients}
              isLoading={globalIngredients.isLoading}
              error={globalIngredients.error}
              onAddIngredient={addRecipeIngredient}
            />

            <UserIngredientsList
              ingredients={userIngredients.ingredients}
              isLoading={userIngredients.isLoading}
              error={userIngredients.error}
              onAddIngredient={addUserRecipeIngredient}
            />

            {query.trim() && !hasExactMatch ? (
              <Button
                variant="ghost"
                onPress={() => {
                  Keyboard.dismiss();
                  setCreatingIngredientName(query.trim());
                  requestAnimationFrame(() => {
                    createIngredientSheetRef.current?.present();
                  });
                }}
              >
                <Text className="font-medium text-brand">
                  Create &apos;{query.trim()}&apos;
                </Text>
              </Button>
            ) : (
              <Button variant="ghost" disabled>
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

          updateIngredient(
            getIngredientReferenceKey(editingIngredient),
            ingredient,
          );
          editIngredientSheetRef.current?.dismiss();
          setEditingIngredient(null);
        }}
      />
      <CreateUserIngredientBottomSheet
        ref={createIngredientSheetRef}
        initialName={creatingIngredientName}
        onDismiss={() => {
          createIngredientSheetRef.current?.dismiss();
          setCreatingIngredientName("");
        }}
        onCreated={(ingredient) => {
          addIngredient({
            userIngredientId: ingredient.id,
            name: ingredient.name,
            quantity: 1,
            unitId: ingredient.defaultUnitId,
          });
          createIngredientSheetRef.current?.dismiss();
          setCreatingIngredientName("");
        }}
      />
    </>
  );
}

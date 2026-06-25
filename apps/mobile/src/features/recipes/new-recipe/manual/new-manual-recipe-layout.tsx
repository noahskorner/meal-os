import { router } from "expo-router";
import { useState, type ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { type NewRecipeRoute, newRecipeRoutes } from "../new-recipe-routes";
import { NewManualRecipeFooter } from "./new-manual-recipe-footer";
import { NewRecipeHeader } from "../new-recipe-header";
import { useNewRecipe } from "../use-new-recipe";

export type NewManualRecipeLayoutProps = {
  children: ReactNode;
  nextLabel: string;
  nextRoute?: NewRecipeRoute;
  backRoute: NewRecipeRoute;
  scroll?: boolean;
};

export function NewManualRecipeLayout({
  children,
  nextLabel,
  nextRoute,
  backRoute,
  scroll = true,
}: NewManualRecipeLayoutProps) {
  const { resetDraft, save } = useNewRecipe();
  const [isSaving, setIsSaving] = useState(false);

  const goNext = async () => {
    if (nextRoute) {
      router.push(nextRoute);
      return;
    }

    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await save();
      resetDraft();
      router.replace(newRecipeRoutes.recipes);
    } catch (error) {
      console.error("Error saving recipe:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const cancel = () => {
    resetDraft();
    router.dismissTo(newRecipeRoutes.recipes);
  };

  return (
    <View className="flex-1 bg-background">
      <NewRecipeHeader
        showCancel
        onBack={() => router.dismissTo(backRoute)}
        onCancel={cancel}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {scroll ? (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 20,
              paddingBottom: 24,
            }}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
          >
            <View className="mt-6">{children}</View>
          </ScrollView>
        ) : (
          children
        )}

        <NewManualRecipeFooter
          primaryLabel={isSaving ? "Saving..." : nextLabel}
          onPrimaryPress={goNext}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

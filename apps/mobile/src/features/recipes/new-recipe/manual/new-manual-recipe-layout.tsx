import { router } from "expo-router";
import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { NewRecipeRoute, newRecipeRoutes } from "../new-recipe-routes";
import { NewManualRecipeFooter } from "./new-manual-recipe-footer";
import { NewRecipeHeader } from "../new-recipe-header";
import { useNewRecipe } from "../use-new-recipe";

export type NewManualRecipeLayoutProps = {
  children: ReactNode;
  nextLabel: string;
  nextRoute?: NewRecipeRoute;
  backFallback: NewRecipeRoute;
  scroll?: boolean;
};

export function NewManualRecipeLayout({
  children,
  nextLabel,
  nextRoute,
  backFallback,
  scroll = true,
}: NewManualRecipeLayoutProps) {
  const { resetDraft } = useNewRecipe();

  const goNext = () => {
    if (nextRoute) {
      router.push(nextRoute);
      return;
    }

    resetDraft();
    router.replace(newRecipeRoutes.recipes);
  };

  const cancel = () => {
    resetDraft();
    router.replace(newRecipeRoutes.chooseMethod);
  };

  return (
    <View className="flex-1 bg-background">
      <NewRecipeHeader
        showCancel
        onBack={() => goBackOrReplace(backFallback)}
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
          primaryLabel={nextLabel}
          onPrimaryPress={goNext}
          secondaryLabel={
            backFallback === newRecipeRoutes.chooseMethod
              ? "Save Draft"
              : "Back"
          }
          onSecondaryPress={
            backFallback === newRecipeRoutes.chooseMethod
              ? undefined
              : () => goBackOrReplace(backFallback)
          }
        />
      </KeyboardAvoidingView>
    </View>
  );
}

export function goBackOrReplace(fallbackRoute: NewRecipeRoute) {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace(fallbackRoute);
}

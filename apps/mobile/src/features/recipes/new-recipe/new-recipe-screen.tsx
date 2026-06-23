import { router } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { NewRecipeSelection } from "./new-recipe-selection";
import { NewRecipeRoute, newRecipeRoutes } from "./new-recipe-routes";
import { NewRecipeHeader } from "./new-recipe-header";

export function NewRecipeScreen() {
  return (
    <View className="flex-1 bg-background">
      <NewRecipeHeader
        showCancel={false}
        onBack={() => goBackOrReplace(newRecipeRoutes.recipes)}
        onCancel={() => {}}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
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
          <NewRecipeSelection
            onManualPress={() => router.push(newRecipeRoutes.manualDetails)}
          />
        </ScrollView>
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

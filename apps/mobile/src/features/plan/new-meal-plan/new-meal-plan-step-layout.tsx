import { router, type Href } from "expo-router";
import { type ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { NewMealPlanFooter } from "./new-meal-plan-footer";
import { NewMealPlanHeader } from "./new-meal-plan-header";
import { newMealPlanRoutes } from "./new-meal-plan-routes";

type NewMealPlanStepLayoutProps = {
  children: ReactNode;
  nextLabel: string;
  nextRoute?: Href;
  onNext?: () => void;
  backRoute: Href;
  scroll?: boolean;
};

export function NewMealPlanStepLayout({
  children,
  nextLabel,
  nextRoute,
  onNext,
  backRoute,
  scroll = true,
}: NewMealPlanStepLayoutProps) {
  const goNext = () => {
    if (onNext) {
      onNext();
      return;
    }

    if (nextRoute) {
      router.push(nextRoute);
    }
  };

  const cancel = () => {
    router.dismissTo(newMealPlanRoutes.plan);
  };

  return (
    <View className="flex-1 bg-background">
      <NewMealPlanHeader
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
            <View className="mt-6 gap-5">{children}</View>
          </ScrollView>
        ) : (
          children
        )}

        <NewMealPlanFooter primaryLabel={nextLabel} onPrimaryPress={goNext} />
      </KeyboardAvoidingView>
    </View>
  );
}

import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Step, steps } from "./steps/step";

interface AddRecipeFooterProps {
  step: Step;
  goNext: () => void;
  goBack: () => void;
}

export function AddRecipeFooter({
  step,
  goNext,
  goBack,
}: AddRecipeFooterProps) {
  return (
    <View className="mt-auto gap-3 px-5 py-4">
      <Button variant="brand" onPress={step === 3 ? undefined : goNext}>
        <Text className="font-semibold text-primary-foreground">
          {step === 3 ? "Save Recipe" : `Next: ${steps[step + 1]}`}
        </Text>
      </Button>

      {step > 0 ? (
        <Button
          variant="outline"
          onPress={goBack}
          className="items-center py-2"
        >
          <Text className="font-medium text-brand text-sm">Back</Text>
        </Button>
      ) : (
        <Button variant="outline" className="items-center py-2">
          <Text className="font-medium text-brand text-sm">Save Draft</Text>
        </Button>
      )}
    </View>
  );
}

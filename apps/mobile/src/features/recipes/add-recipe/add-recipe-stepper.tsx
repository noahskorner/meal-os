import { View } from "react-native";
import { Check } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Step, steps } from "./steps/step";

export function AddRecipeStepper({ currentStep }: { currentStep: Step }) {
  return (
    <View className="pt-4">
      <View className="flex-row items-start justify-between">
        {steps.map((label, index) => {
          const isComplete = index < currentStep;
          const isActive = index === currentStep;

          return (
            <View key={label} className="flex-1 items-center">
              <View
                className={[
                  "h-7 w-7 items-center justify-center rounded-full",
                  isActive || isComplete
                    ? "bg-brand"
                    : "border border-border bg-background",
                ].join(" ")}
              >
                {isComplete ? (
                  <Check size={14} color="white" />
                ) : (
                  <Text
                    className={[
                      "text-xs font-semibold",
                      isActive ? "text-white" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>

              <Text
                className={[
                  "mt-2 text-xs",
                  isActive
                    ? "font-semibold text-brand"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

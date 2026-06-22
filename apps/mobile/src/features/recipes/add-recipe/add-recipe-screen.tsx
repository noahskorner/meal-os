import { useState } from "react";
import { View } from "react-native";
import { Step } from "./steps/step";
import { AddRecipeFooter } from "./add-recipe-footer";
import { AddRecipeHeader } from "./add-recipe-header";
import { AddRecipeMethodSelection } from "./add-recipe-method";
import { AddRecipeStepper } from "./add-recipe-stepper";
import { DetailsStep } from "./steps/details-step";
import { IngredientsStep } from "./steps/ingredients-step";
import { InstructionsStep } from "./steps/instructions-step";
import { ReviewStep } from "./steps/review-step";

type Flow = "select" | "manual" | "paste" | "upload";

export function AddRecipeScreen() {
  const [flow, setFlow] = useState<Flow>("select");
  const [step, setStep] = useState<Step>(0);

  const isSelecting = flow === "select";

  const goBack = () => {
    if (!isSelecting && step === 0) {
      setFlow("select");
      return;
    }

    setStep((current) => Math.max(current - 1, 0) as Step);
  };

  const startManualFlow = () => {
    setFlow("manual");
    setStep(0);
  };

  const goNext = () => {
    setStep((current) => Math.min(current + 1, 3) as Step);
  };

  return (
    <View className="flex-1 bg-background">
      <AddRecipeHeader
        showCancel={!isSelecting}
        onBack={goBack}
        onCancel={() => {
          setFlow("select");
          setStep(0);
        }}
      />

      <View className="flex-1 px-5">
        {isSelecting ? (
          <AddRecipeMethodSelection onManualPress={startManualFlow} />
        ) : (
          <>
            <AddRecipeStepper currentStep={step} />

            <View className="mt-6">
              {step === 0 && <DetailsStep />}
              {step === 1 && <IngredientsStep />}
              {step === 2 && <InstructionsStep />}
              {step === 3 && <ReviewStep />}
            </View>
          </>
        )}
      </View>

      {!isSelecting && (
        <AddRecipeFooter step={step} goNext={goNext} goBack={goBack} />
      )}
    </View>
  );
}
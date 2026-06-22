import { StepTitle } from "./step-title";
import { Pressable, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GripVertical, Plus, Trash2 } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useState } from "react";

type InstructionStep = {
  id: string;
  text: string;
};

const createStep = (text = ""): InstructionStep => ({
  id: crypto.randomUUID(),
  text,
});

export function InstructionsStep() {
  const [steps, setSteps] = useState<InstructionStep[]>([
    createStep("Season both sides of the chicken with salt and pepper."),
    createStep("Heat olive oil in a large skillet over medium-high heat."),
    createStep(
      "Add the chicken and cook for 6-7 minutes per side, until golden and cooked through.",
    ),
    createStep("Add garlic and cook for 30 seconds until fragrant."),
    createStep(
      "Squeeze lemon juice over the chicken and garnish with fresh parsley. Serve warm.",
    ),
  ]);

  const addStep = () => {
    setSteps((current) => [...current, createStep()]);
  };

  const updateStep = (id: string, text: string) => {
    setSteps((current) =>
      current.map((step) => (step.id === id ? { ...step, text } : step)),
    );
  };

  const removeStep = (id: string) => {
    setSteps((current) => current.filter((step) => step.id !== id));
  };

  const renderStep = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<InstructionStep>) => {
    const index = getIndex() ?? 0;

    return (
      <ScaleDecorator>
        <View className={isActive ? "opacity-90" : ""}>
          <View className="flex-row items-center gap-2">
            <Pressable
              onLongPress={drag}
              disabled={isActive}
              className="h-10 w-6 items-center justify-center"
              hitSlop={8}
            >
              <GripVertical size={18} className="text-muted-foreground" />
            </Pressable>

            <Card className="flex-1 flex-row items-start gap-3 rounded-xl border border-border bg-card p-3">
              <View className="h-8 w-8 items-center justify-center rounded-md border border-border bg-background">
                <Text className="text-sm font-medium text-foreground">
                  {index + 1}
                </Text>
              </View>

              <Input
                multiline
                value={item.text}
                onChangeText={(text) => updateStep(item.id, text)}
                placeholder="Describe this step..."
                className="min-h-12 flex-1 border-0 bg-transparent px-0 py-0 text-sm shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                textAlignVertical="top"
              />

              <Pressable
                className="p-1"
                onPress={() => removeStep(item.id)}
                disabled={steps.length === 1}
                hitSlop={8}
              >
                <Trash2 size={18} className="text-muted-foreground" />
              </Pressable>
            </Card>
          </View>
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <View className="gap-5">
      <StepTitle
        title="Instructions"
        subtitle="Add step-by-step instructions."
      />
      <DraggableFlatList
        data={steps}
        keyExtractor={(item) => item.id}
        renderItem={renderStep}
        onDragEnd={({ data }) => setSteps(data)}
        scrollEnabled={false}
        containerStyle={{ overflow: "visible" }}
        contentContainerStyle={{ gap: 12 }}
        activationDistance={8}
      />
      <Button variant="secondary" size="sm" onPress={addStep}>
        <Plus size={16} className="text-brand" />
        <Text className="font-medium text-brand">Add Step</Text>
      </Button>
    </View>
  );
}

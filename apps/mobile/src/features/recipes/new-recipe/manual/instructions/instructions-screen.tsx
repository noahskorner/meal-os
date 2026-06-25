import { StepTitle } from "../step-title";
import { Pressable, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GripVertical, Trash2 } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import type { CreateRecipeStepRequest } from "@repo/web-api-client";
import { useNewRecipe } from "../../use-new-recipe";

export function InstructionsScreen() {
  const { recipe, addStep, removeStep, updateStep, reorderSteps } =
    useNewRecipe();
  const instructions = recipe.recipeSteps || [];

  const renderStep = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<CreateRecipeStepRequest>) => {
    const index = getIndex() ?? 0;
    const sortOrder = item.sortOrder ?? index + 1;

    return (
      <ScaleDecorator>
        <View className={isActive ? "opacity-90" : ""}>
          <View className="flex-row items-center gap-2">
            <Pressable
              onPressIn={drag}
              disabled={isActive}
              className="h-10 w-6 items-center justify-center"
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Reorder step ${index + 1}`}
            >
              <Icon
                as={GripVertical}
                size={18}
                className="text-muted-foreground"
              />
            </Pressable>

            <Card className="flex-1 flex-row items-start gap-3 rounded-xl border border-border bg-card p-3">
              <View className="h-8 w-8 items-center justify-center rounded-md border border-border bg-background">
                <Text className="text-sm font-medium text-foreground">
                  {index + 1}
                </Text>
              </View>

              <Input
                multiline
                scrollEnabled={false}
                value={item.text}
                onChangeText={(text) => updateStep(sortOrder, { text })}
                placeholder="Describe this step..."
                className="h-auto min-h-12 flex-1 border-0 bg-transparent px-0 py-0 text-sm shadow-none dark:bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                textAlignVertical="top"
              />

              <Pressable
                className="p-1"
                onPress={() => removeStep(sortOrder)}
                disabled={instructions.length === 1}
                hitSlop={8}
              >
                <Icon as={Trash2} size={18} className="text-muted-foreground" />
              </Pressable>
            </Card>
          </View>
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <DraggableFlatList
      data={instructions}
      keyExtractor={(item, index) => String(item.sortOrder ?? index)}
      renderItem={renderStep}
      onDragEnd={({ data }) => reorderSteps(data)}
      containerStyle={{ flex: 1 }}
      contentContainerStyle={{
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: 24,
      }}
      ItemSeparatorComponent={() => <View className="h-3" />}
      ListHeaderComponent={
        <View className="mb-5">
          <StepTitle
            title="Instructions"
            subtitle="Add step-by-step instructions."
          />
        </View>
      }
      ListFooterComponent={
        <Button variant="ghost" size="sm" onPress={addStep} className="mt-5">
          <Text className="font-medium text-brand">Add Step</Text>
        </Button>
      }
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      activationDistance={8}
    />
  );
}

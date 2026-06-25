import { BottomSheet, BottomSheetContent } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { inputVariants } from "@/components/ui/input";
import {
  NativeSelectScrollView,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type Option,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { useUnits } from "@/features/units/use-units";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import type { CreateRecipeIngredientRequest } from "@repo/web-api-client";
import { X } from "lucide-react-native";
import * as React from "react";
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  Pressable,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type EditRecipeIngredientBottomSheetProps = {
  ingredient: CreateRecipeIngredientRequest | null;
  onDismiss: () => void;
  onSave: (
    ingredient: Pick<CreateRecipeIngredientRequest, "quantity" | "unitId">,
  ) => void;
};

const bottomSheetSnapPoints = ["72%", "92%"];
const amountInputAccessoryViewID = "recipe-ingredient-amount-keyboard";

function formatQuantity(quantity: number | undefined) {
  return quantity === undefined ? "1" : String(quantity);
}

export const EditRecipeIngredientBottomSheet = React.forwardRef<
  React.ElementRef<typeof BottomSheet>,
  EditRecipeIngredientBottomSheetProps
>(function EditRecipeIngredientBottomSheet(
  { ingredient, onDismiss, onSave },
  ref,
) {
  const { units, isLoading } = useUnits();
  const insets = useSafeAreaInsets();
  const amountInputRef =
    React.useRef<React.ElementRef<typeof BottomSheetTextInput>>(null);
  const [quantity, setQuantity] = React.useState("1");
  const [unitId, setUnitId] = React.useState<string | undefined>();

  React.useEffect(() => {
    setQuantity(formatQuantity(ingredient?.quantity));
    setUnitId(ingredient?.unitId);
  }, [ingredient]);

  const parsedQuantity = Number(quantity);
  const canSave = Number.isFinite(parsedQuantity) && parsedQuantity > 0 && !!unitId;
  const selectedUnit = units.find((item) => item.id === unitId);
  const selectedUnitOption = React.useMemo<Option>(() => {
    if (!selectedUnit) {
      return undefined;
    }

    return {
      value: selectedUnit.id,
      label: selectedUnit.abbreviation,
    };
  }, [selectedUnit]);
  const blurAmountInput = () => {
    amountInputRef.current?.blur();
    Keyboard.dismiss();
  };

  return (
    <BottomSheet
      ref={ref}
      index={0}
      snapPoints={bottomSheetSnapPoints}
      enableDynamicSizing={false}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      enableBlurKeyboardOnGesture
      android_keyboardInputMode="adjustResize"
      topInset={insets.top + 12}
    >
      <BottomSheetContent className="gap-5">
        <View className="flex-row items-start justify-between gap-4">
          <View className="min-w-0 flex-1 gap-1">
            <Text className="text-lg font-semibold text-foreground">
              Edit Ingredient
            </Text>
            {ingredient ? (
              <Text className="text-base font-medium text-foreground">
                {ingredient.name}
              </Text>
            ) : null}
          </View>

          <Pressable
            className="p-1"
            onPress={onDismiss}
            hitSlop={8}
          >
            <Icon as={X} size={20} className="text-foreground" />
          </Pressable>
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">Amount</Text>
          <BottomSheetTextInput
            ref={amountInputRef}
            accessibilityLabel="Ingredient amount"
            className={inputVariants({ size: "default" })}
            inputAccessoryViewID={amountInputAccessoryViewID}
            keyboardType="decimal-pad"
            returnKeyType="done"
            submitBehavior="blurAndSubmit"
            value={quantity}
            onChangeText={setQuantity}
            onSubmitEditing={Keyboard.dismiss}
            placeholder="1"
          />
          {Platform.OS === "ios" ? (
            <InputAccessoryView nativeID={amountInputAccessoryViewID}>
              <View className="items-end border-t border-border bg-card px-4 py-2">
                <Pressable onPress={Keyboard.dismiss} hitSlop={8}>
                  <Text className="text-sm font-semibold text-brand">Done</Text>
                </Pressable>
              </View>
            </InputAccessoryView>
          ) : null}
        </View>

        <View className="gap-3">
          <Text className="text-sm font-medium text-foreground">Unit</Text>
          <Select
            value={selectedUnitOption}
            onValueChange={(option) => setUnitId(option?.value)}
            onOpenChange={(isOpen) => {
              if (isOpen) {
                blurAmountInput();
              }
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={isLoading ? "Loading units" : "Select unit"}
              />
            </SelectTrigger>
            <SelectContent className="min-w-64">
              <NativeSelectScrollView>
                <SelectGroup>
                  {units.map((unit) => (
                    <SelectItem
                      key={unit.id}
                      value={unit.id}
                      label={`${unit.abbreviation} - ${unit.name}`}
                    >
                      {unit.abbreviation} - {unit.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </NativeSelectScrollView>
            </SelectContent>
          </Select>
        </View>

        <Button
          variant="brand"
          disabled={!canSave}
          onPress={() => {
            if (!canSave) {
              return;
            }

            onSave({
              quantity: parsedQuantity,
              unitId,
            });
          }}
        >
          <Text>Save</Text>
        </Button>
      </BottomSheetContent>
    </BottomSheet>
  );
});

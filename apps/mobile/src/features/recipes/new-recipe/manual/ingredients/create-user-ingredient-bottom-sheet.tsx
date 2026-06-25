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
import { useIngredientCategories } from "@/features/ingredients/list-categories/use-ingredient-categories";
import { useUnits } from "@/features/units/use-units";
import { BottomSheetTextInput as BottomSheetInput } from "@gorhom/bottom-sheet";
import type { CreateUserIngredientRequest } from "@repo/web-api-client";
import { X } from "lucide-react-native";
import * as React from "react";
import { Keyboard, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useCreateUserIngredient,
  type CreatedUserIngredient,
} from "./use-create-user-ingredient";

type CreateUserIngredientBottomSheetProps = {
  initialName: string;
  onCreated: (ingredient: CreatedUserIngredient) => void;
  onDismiss: () => void;
};

const bottomSheetSnapPoints = ["72%", "92%"];
const noCategoryValue = "none";
const noUnitValue = "none";

function createOption(item: { id: string; name: string } | undefined): Option {
  if (!item) {
    return undefined;
  }

  return {
    value: item.id,
    label: item.name,
  };
}

type OptionalSelectProps = {
  onOpen: () => void;
};

type CategorySelectProps = OptionalSelectProps & {
  categoryId: string | undefined;
  onCategoryIdChange: (categoryId: string | undefined) => void;
};

function CategorySelect({
  categoryId,
  onCategoryIdChange,
  onOpen,
}: CategorySelectProps) {
  const { ingredientCategories, isLoading: isLoadingCategories } =
    useIngredientCategories();
  const selectedCategory = ingredientCategories.find(
    (category) => category.id === categoryId,
  );
  const selectedCategoryOption = React.useMemo(
    () => createOption(selectedCategory),
    [selectedCategory],
  );

  return (
    <View className="gap-3">
      <Text className="text-sm font-medium text-foreground">Category</Text>
      <Select
        value={selectedCategoryOption}
        onValueChange={(option) => {
          onCategoryIdChange(
            option?.value === noCategoryValue ? undefined : option?.value,
          );
        }}
        onOpenChange={(isOpen) => {
          if (isOpen) {
            onOpen();
          }
        }}
        disabled={isLoadingCategories}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={
              isLoadingCategories ? "Loading categories" : "No category"
            }
          />
        </SelectTrigger>
        <SelectContent className="min-w-64">
          <NativeSelectScrollView>
            <SelectGroup>
              <SelectItem value={noCategoryValue} label="No category">
                No category
              </SelectItem>
              {ingredientCategories.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                  label={category.name}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </NativeSelectScrollView>
        </SelectContent>
      </Select>
    </View>
  );
}

type DefaultUnitSelectProps = OptionalSelectProps & {
  defaultUnitId: string | undefined;
  onDefaultUnitIdChange: (defaultUnitId: string | undefined) => void;
};

function DefaultUnitSelect({
  defaultUnitId,
  onDefaultUnitIdChange,
  onOpen,
}: DefaultUnitSelectProps) {
  const { units, isLoading: isLoadingUnits } = useUnits();
  const selectedUnit = units.find((unit) => unit.id === defaultUnitId);
  const selectedUnitOption = React.useMemo<Option>(() => {
    if (!selectedUnit) {
      return undefined;
    }

    return {
      value: selectedUnit.id,
      label: selectedUnit.abbreviation,
    };
  }, [selectedUnit]);

  return (
    <View className="gap-3">
      <Text className="text-sm font-medium text-foreground">Default Unit</Text>
      <Select
        value={selectedUnitOption}
        onValueChange={(option) => {
          onDefaultUnitIdChange(
            option?.value === noUnitValue ? undefined : option?.value,
          );
        }}
        onOpenChange={(isOpen) => {
          if (isOpen) {
            onOpen();
          }
        }}
        disabled={isLoadingUnits}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={isLoadingUnits ? "Loading units" : "No unit"}
          />
        </SelectTrigger>
        <SelectContent className="min-w-64">
          <NativeSelectScrollView>
            <SelectGroup>
              <SelectItem value={noUnitValue} label="No unit">
                No unit
              </SelectItem>
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
  );
}

export const CreateUserIngredientBottomSheet = React.forwardRef<
  React.ElementRef<typeof BottomSheet>,
  CreateUserIngredientBottomSheetProps
>(function CreateUserIngredientBottomSheet(
  { initialName, onCreated, onDismiss },
  forwardedRef,
) {
  const sheetRef = React.useRef<React.ElementRef<typeof BottomSheet>>(null);
  const nameInputRef =
    React.useRef<React.ElementRef<typeof BottomSheetInput>>(null);
  const insets = useSafeAreaInsets();
  const {
    createIngredient,
    error,
    isCreating,
    reset: resetCreateIngredient,
  } = useCreateUserIngredient();
  const [name, setName] = React.useState(initialName);
  const [categoryId, setCategoryId] = React.useState<string | undefined>();
  const [defaultUnitId, setDefaultUnitId] = React.useState<
    string | undefined
  >();

  const setBottomSheetRef = React.useCallback(
    (instance: React.ElementRef<typeof BottomSheet> | null) => {
      sheetRef.current = instance;

      if (typeof forwardedRef === "function") {
        forwardedRef(instance);
      } else if (forwardedRef) {
        forwardedRef.current = instance;
      }
    },
    [forwardedRef],
  );

  React.useEffect(() => {
    setName(initialName);
    setCategoryId(undefined);
    setDefaultUnitId(undefined);
    resetCreateIngredient();
  }, [initialName, resetCreateIngredient]);

  const trimmedName = name.trim();
  const canCreate = trimmedName.length > 0 && !isCreating;

  const focusNameInput = () => {
    sheetRef.current?.snapToIndex(1);
  };

  const blurNameInput = () => {
    nameInputRef.current?.blur();
    Keyboard.dismiss();
  };

  const saveIngredient = async () => {
    if (!canCreate) {
      return;
    }

    const body: CreateUserIngredientRequest = {
      name: trimmedName,
      categoryId,
      defaultUnitId,
    };

    try {
      const ingredient = await createIngredient(body);
      onCreated(ingredient);
    } catch {
      return;
    }
  };

  return (
    <BottomSheet
      ref={setBottomSheetRef}
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
              Create Ingredient
            </Text>
            <Text className="text-sm text-muted-foreground">
              Add a custom ingredient to this recipe.
            </Text>
          </View>

          <Pressable className="p-1" onPress={onDismiss} hitSlop={8}>
            <Icon as={X} size={20} className="text-foreground" />
          </Pressable>
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">Name</Text>
          <BottomSheetInput
            ref={nameInputRef}
            accessibilityLabel="Ingredient name"
            autoCapitalize="words"
            className={inputVariants({ size: "default" })}
            returnKeyType="done"
            submitBehavior="blurAndSubmit"
            value={name}
            onChangeText={setName}
            onFocus={focusNameInput}
            onSubmitEditing={Keyboard.dismiss}
            placeholder="Ingredient name"
          />
        </View>

        <CategorySelect
          categoryId={categoryId}
          onCategoryIdChange={setCategoryId}
          onOpen={blurNameInput}
        />

        <DefaultUnitSelect
          defaultUnitId={defaultUnitId}
          onDefaultUnitIdChange={setDefaultUnitId}
          onOpen={blurNameInput}
        />

        {error ? (
          <Text className="text-sm font-medium text-destructive">{error}</Text>
        ) : null}

        <Button variant="brand" disabled={!canCreate} onPress={saveIngredient}>
          <Text>{isCreating ? "Creating" : "Create"}</Text>
        </Button>
      </BottomSheetContent>
    </BottomSheet>
  );
});

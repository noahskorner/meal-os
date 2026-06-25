import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Header } from "@/components/header";
import { THEME } from "@/lib/theme";
import { router } from "expo-router";
import {
  ArrowUpRight,
  ChefHat,
  ChevronLeft,
  Clock3,
  ListOrdered,
  type LucideIcon,
  Scale,
  SquareStack,
  UsersRound,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import type { ReactNode } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Pressable,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetRecipe } from "./use-get-recipe";

export function GetRecipeScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const palette = colorScheme === "dark" ? THEME.dark : THEME.light;
  const { recipeDetails, isLoading, isRefreshing, error, refreshRecipe } =
    useGetRecipe();

  return (
    <View className="flex-1 bg-background">
      <Header
        left={
          <Pressable
            accessibilityLabel="Back to recipes"
            className="h-10 w-10 items-center justify-center"
            onPress={() => router.back()}
          >
            <ChevronLeft color={palette.foreground} size={22} />
          </Pressable>
        }
        title={recipeDetails?.name ?? ""}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center px-8">
          <ActivityIndicator color={palette.brand} />
          <Text className="mt-4 text-sm text-muted-foreground">
            Loading recipe...
          </Text>
        </View>
      ) : error || !recipeDetails ? (
        <View className="flex-1 items-center justify-center gap-4 px-8">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-muted">
            <ChefHat color={palette.brand} size={28} strokeWidth={2} />
          </View>
          <Text className="text-center text-lg font-semibold text-foreground">
            Unable to load recipe
          </Text>
          <Text className="text-center text-sm leading-6 text-muted-foreground">
            {error ?? "Recipe not found."}
          </Text>
          <Button variant="brand" onPress={refreshRecipe}>
            <Text>Try again</Text>
          </Button>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: insets.bottom + 28,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              tintColor={palette.brand}
              onRefresh={refreshRecipe}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-4">
            <Card className="gap-4 overflow-hidden py-0">
              <View className="h-40 items-center justify-center bg-brand-muted">
                <ChefHat color={palette.brand} size={44} strokeWidth={1.8} />
              </View>

              <CardContent className="gap-5 px-5 pb-5">
                <View className="gap-2">
                  <Text className="text-3xl font-bold leading-9 text-card-foreground">
                    {recipeDetails.name}
                  </Text>
                  <Text className="text-base leading-7 text-muted-foreground">
                    {recipeDetails.description}
                  </Text>
                </View>

                <View className="flex-row flex-wrap gap-3">
                  <RecipeStat
                    icon={UsersRound}
                    label="Servings"
                    value={recipeDetails.servings}
                  />
                  <RecipeStat
                    icon={Clock3}
                    label="Total time"
                    value={recipeDetails.totalTime}
                  />
                  <RecipeStat
                    icon={SquareStack}
                    label="Recipe ID"
                    value={recipeDetails.id}
                  />
                </View>

                <View className="flex-row gap-3">
                  <MetricCard
                    label="Prep"
                    value={recipeDetails.prepTime}
                  />
                  <MetricCard
                    label="Cook"
                    value={recipeDetails.cookTime}
                  />
                  <MetricCard
                    label="Steps"
                    value={`${recipeDetails.stepCount}`}
                  />
                </View>
              </CardContent>
            </Card>

            <SectionCard
              title="Ingredients"
              subtitle={`${recipeDetails.ingredientCount} items`}
            >
              {recipeDetails.ingredients.length > 0 ? (
                <View className="gap-3">
                  {recipeDetails.ingredients.map((ingredient, index) => (
                    <IngredientRow
                      key={ingredient.id}
                      index={index + 1}
                      ingredient={ingredient}
                    />
                  ))}
                </View>
              ) : (
                <EmptySectionText text="No ingredients added." />
              )}
            </SectionCard>

            <SectionCard
              title="Instructions"
              subtitle={`${recipeDetails.stepCount} steps`}
            >
              {recipeDetails.steps.length > 0 ? (
                <View className="gap-3">
                  {recipeDetails.steps.map((step, index) => (
                    <StepRow key={step.id} index={index + 1} step={step} />
                  ))}
                </View>
              ) : (
                <EmptySectionText text="No steps added." />
              )}
            </SectionCard>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="gap-4 px-5 py-5">
        <View className="flex-row items-center justify-between gap-3">
          <Text className="text-xl font-semibold text-card-foreground">
            {title}
          </Text>
          <Text className="text-sm text-muted-foreground">{subtitle}</Text>
        </View>
        {children}
      </CardContent>
    </Card>
  );
}

function RecipeStat({
  icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <View className="min-w-[47%] flex-1 rounded-xl border border-border bg-background px-3 py-3">
      <View className="flex-row items-center gap-2">
        <Icon as={icon} className="text-brand" size={16} />
        <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </Text>
      </View>
      <Text className="mt-2 text-sm font-semibold leading-5 text-foreground">
        {value}
      </Text>
    </View>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-xl border border-border bg-background px-3 py-3">
      <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </Text>
      <Text className="mt-2 text-base font-semibold text-foreground">
        {value}
      </Text>
    </View>
  );
}

function IngredientRow({
  index,
  ingredient,
}: {
  index: number;
  ingredient: {
    id: string;
    ingredientId: string;
    name: string;
    quantity: number | null;
    unitId: string | null;
    preparation: string | null;
    note: string | null;
    isOptional: boolean | null;
    quantityLabel: string;
    unitIdLabel: string;
    preparationLabel: string;
    noteLabel: string;
    isOptionalLabel: string;
  };
}) {
  return (
    <View className="rounded-xl border border-border bg-background p-4">
      <View className="flex-row items-start gap-3">
        <View className="h-8 w-8 items-center justify-center rounded-lg bg-brand-muted">
          <Text className="text-xs font-semibold text-brand">{index}</Text>
        </View>

        <View className="min-w-0 flex-1 gap-2">
          <Text className="text-base font-semibold leading-6 text-foreground">
            {ingredient.name}
          </Text>

          <View className="gap-1.5">
            <MetadataRow
              icon={Scale}
              label="Quantity"
              value={ingredient.quantityLabel}
            />
            <MetadataRow
              icon={Scale}
              label="Unit ID"
              value={ingredient.unitIdLabel}
            />
            <MetadataRow
              icon={Scale}
              label="Preparation"
              value={ingredient.preparationLabel}
            />
            <MetadataRow
              icon={Scale}
              label="Note"
              value={ingredient.noteLabel}
            />
            <MetadataRow
              icon={Scale}
              label="Optional"
              value={ingredient.isOptionalLabel}
            />
            <MetadataRow
              icon={ArrowUpRight}
              label="Ingredient ID"
              value={ingredient.ingredientId}
            />
            <MetadataRow icon={SquareStack} label="Row ID" value={ingredient.id} />
          </View>
        </View>
      </View>
    </View>
  );
}

function StepRow({
  index,
  step,
}: {
  index: number;
  step: {
    id: string;
    text: string;
    sortOrder: number;
  };
}) {
  return (
    <View className="rounded-xl border border-border bg-background p-4">
      <View className="flex-row items-start gap-3">
        <View className="h-8 w-8 items-center justify-center rounded-lg bg-brand-muted">
          <Text className="text-xs font-semibold text-brand">{index}</Text>
        </View>

        <View className="min-w-0 flex-1 gap-3">
          <Text className="text-base leading-7 text-foreground">{step.text}</Text>

          <View className="gap-1.5">
            <MetadataRow
              icon={ListOrdered}
              label="Sort order"
              value={`${step.sortOrder}`}
            />
            <MetadataRow icon={SquareStack} label="Step ID" value={step.id} />
          </View>
        </View>
      </View>
    </View>
  );
}

function MetadataRow({
  icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-start gap-2">
      <Icon as={icon} className="mt-0.5 text-muted-foreground" size={14} />
      <Text className="min-w-0 flex-1 text-sm leading-5 text-muted-foreground">
        <Text className="font-semibold text-foreground">{label}: </Text>
        {value}
      </Text>
    </View>
  );
}

function EmptySectionText({ text }: { text: string }) {
  return (
    <View className="rounded-xl border border-dashed border-border bg-background px-4 py-6">
      <Text className="text-sm text-muted-foreground">{text}</Text>
    </View>
  );
}

import {
  BarChart3,
  Camera,
  Clock,
  type LucideIcon,
  Users,
} from "lucide-react-native";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { Image, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useNewRecipe } from "../../use-new-recipe";
import { StepTitle } from "../step-title";

export function ReviewScreen() {
  const { recipe } = useNewRecipe();
  const recipeIngredients = recipe.recipeIngredients || [];
  const instructions = recipe.recipeSteps || [];
  const recipeName = recipe.name.trim() || "Untitled Recipe";
  const servings = formatServings(recipe.servings);
  const totalTime = formatTotalTime(
    recipe.prepTimeMinutes,
    recipe.cookTimeMinutes,
  );
  const instructionItems = instructions.filter((step) => step.text.trim());

  return (
    <View className="gap-5">
      <StepTitle
        title="Review Your Recipe"
        subtitle="Review and make any final changes."
      />

      <ReviewPhoto />

      <View className="gap-3">
        <Text className="text-2xl font-bold text-foreground">{recipeName}</Text>

        <View className="flex-row items-center justify-between">
          <RecipeStat icon={Users} label={servings} />
          <RecipeStat icon={Clock} label={totalTime} />
          <RecipeStat icon={BarChart3} label="Manual recipe" />
        </View>
      </View>

      <View className="gap-3">
        <ReviewSection
          title="Ingredients"
          count={recipeIngredients.length}
          onEdit={() => router.push("/recipes/new/manual/ingredients")}
        >
          {recipeIngredients.length > 0 ? (
            <View className="gap-2">
              {recipeIngredients.map((ingredient) => (
                <ReviewListItem
                  key={ingredient.ingredientId}
                  text={ingredient.name}
                />
              ))}
            </View>
          ) : (
            <EmptyReviewText text="No ingredients added." />
          )}
        </ReviewSection>

        <ReviewSection
          title="Instructions"
          count={instructionItems.length}
          countLabel="steps"
          onEdit={() => router.push("/recipes/new/manual/instructions")}
        >
          {instructionItems.length > 0 ? (
            <View className="gap-3">
              {instructionItems.map((instruction, index) => (
                <InstructionListItem
                  key={instruction.sortOrder ?? index}
                  index={index + 1}
                  text={instruction.text}
                />
              ))}
            </View>
          ) : (
            <EmptyReviewText text="No instructions added." />
          )}
        </ReviewSection>
      </View>
    </View>
  );
}

function ReviewPhoto() {
  return (
    <View className="overflow-hidden rounded-xl border border-border bg-muted">
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1200&auto=format&fit=crop",
        }}
        className="h-36 w-full"
        resizeMode="cover"
      />
      <Button
        variant="secondary"
        size="sm"
        className="absolute bottom-3 right-3 bg-background px-3"
      >
        <Icon as={Camera} size={16} className="text-foreground" />
        <Text className="text-sm font-medium text-foreground">Edit Photo</Text>
      </Button>
    </View>
  );
}

function RecipeStat({ icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <View className="flex-row items-center gap-2">
      <Icon as={icon} size={18} className="text-muted-foreground" />
      <Text className="text-sm text-muted-foreground">{label}</Text>
    </View>
  );
}

function ReviewSection({
  title,
  count,
  countLabel,
  onEdit,
  children,
}: {
  title: string;
  count: number;
  countLabel?: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  const heading = countLabel
    ? `${title} (${count} ${countLabel})`
    : `${title} (${count})`;

  return (
    <View className="gap-3 border-t border-border pt-3">
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-foreground">{heading}</Text>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto px-1 py-1"
          onPress={onEdit}
        >
          <Text className="text-xs font-semibold text-brand">Edit</Text>
        </Button>
      </View>

      {children}
    </View>
  );
}

function ReviewListItem({ text }: { text: string }) {
  return (
    <Card className="rounded-lg border border-border bg-card px-3 py-2">
      <Text className="text-sm text-foreground">{text}</Text>
    </Card>
  );
}

function EmptyReviewText({ text }: { text: string }) {
  return <Text className="text-sm text-muted-foreground">{text}</Text>;
}

function InstructionListItem({ index, text }: { index: number; text: string }) {
  return (
    <View className="flex-row gap-3">
      <View className="h-7 w-7 items-center justify-center rounded-md border border-border bg-background">
        <Text className="text-xs font-semibold text-foreground">{index}</Text>
      </View>
      <Text className="min-w-0 flex-1 text-sm leading-5 text-foreground">
        {text}
      </Text>
    </View>
  );
}

function formatServings(servings?: number) {
  if (!servings) {
    return "Servings not set";
  }

  return `${servings} servings`;
}

function formatTotalTime(prepTime?: number, cookTime?: number) {
  const totalTime = (prepTime || 0) + (cookTime || 0);

  if (!totalTime) {
    return "Time not set";
  }

  return `${totalTime} min`;
}

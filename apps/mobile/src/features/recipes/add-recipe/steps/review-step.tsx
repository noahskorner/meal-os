import {
  BarChart3,
  Camera,
  Clock,
  type LucideIcon,
  Users,
} from "lucide-react-native";
import { Image, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { StepTitle } from "./step-title";

const recipePreview = {
  name: "Lemon Garlic Chicken",
  photoUrl:
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1200&auto=format&fit=crop",
  servings: "4 servings",
  totalTime: "30 min",
  difficulty: "Easy",
  ingredients: [
    "4 boneless chicken breasts",
    "3 cloves garlic, minced",
    "2 lemons, juiced and sliced",
    "2 tbsp olive oil",
    "1 tsp kosher salt",
    "1/2 tsp black pepper",
    "2 tbsp fresh parsley",
  ],
  instructions: [
    "Season both sides of the chicken with salt and pepper.",
    "Heat olive oil in a large skillet over medium-high heat.",
    "Add chicken and cook 6-7 minutes per side until golden and cooked through.",
    "Add garlic and cook for 30 seconds until fragrant.",
    "Squeeze lemon juice over chicken, garnish with parsley, and serve warm.",
  ],
};

export function ReviewStep() {
  return (
    <View className="gap-5">
      <StepTitle
        title="Review Your Recipe"
        subtitle="Review and make any final changes."
      />

      <ReviewPhoto />

      <View className="gap-3">
        <Text className="text-2xl font-bold text-foreground">
          {recipePreview.name}
        </Text>

        <View className="flex-row items-center justify-between">
          <RecipeStat icon={Users} label={recipePreview.servings} />
          <RecipeStat icon={Clock} label={recipePreview.totalTime} />
          <RecipeStat icon={BarChart3} label={recipePreview.difficulty} />
        </View>
      </View>

      <View className="gap-3">
        <ReviewSection
          title="Ingredients"
          count={recipePreview.ingredients.length}
        >
          <View className="gap-2">
            {recipePreview.ingredients.map((ingredient) => (
              <ReviewListItem key={ingredient} text={ingredient} />
            ))}
          </View>
        </ReviewSection>

        <ReviewSection
          title="Instructions"
          count={recipePreview.instructions.length}
          countLabel="steps"
        >
          <View className="gap-3">
            {recipePreview.instructions.map((instruction, index) => (
              <InstructionListItem
                key={instruction}
                index={index + 1}
                text={instruction}
              />
            ))}
          </View>
        </ReviewSection>

        <View className="gap-2">
          <Text className="font-semibold text-foreground">Notes</Text>
          <Textarea
            placeholder="Add any notes about this recipe..."
            scrollEnabled={false}
            className="h-auto min-h-24 bg-background"
          />
        </View>
      </View>
    </View>
  );
}

function ReviewPhoto() {
  return (
    <View className="overflow-hidden rounded-xl border border-border bg-muted">
      <Image
        source={{ uri: recipePreview.photoUrl }}
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
  children,
}: {
  title: string;
  count: number;
  countLabel?: string;
  children: React.ReactNode;
}) {
  const heading = countLabel
    ? `${title} (${count} ${countLabel})`
    : `${title} (${count})`;

  return (
    <View className="gap-3 border-t border-border pt-3">
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-foreground">{heading}</Text>
        <Button variant="ghost" size="sm" className="h-auto px-1 py-1">
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

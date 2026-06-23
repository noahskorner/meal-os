import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import {
  ChartNoAxesColumnIncreasing,
  ChefHat,
  ChevronRight,
  Clock3,
  Ellipsis,
  UsersRound,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";
import { Recipe } from "./recipe";

export type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { colorScheme } = useColorScheme();
  const palette = colorScheme === "dark" ? THEME.dark : THEME.light;
  const thumbnailClassName =
    recipe.accent === "brand"
      ? "bg-brand-muted"
      : recipe.accent === "secondary"
        ? "bg-secondary"
        : "bg-muted";

  return (
    <Pressable className="min-h-24 flex-row items-center gap-3 rounded-lg border border-border bg-card shadow-sm shadow-black/5 p-2">
      <View
        className={`h-20 w-24 items-center justify-center rounded-lg ${thumbnailClassName}`}
      >
        <ChefHat color={palette.brand} size={30} strokeWidth={1.8} />
      </View>

      <View className="min-w-0 flex-1 gap-3 py-1">
        <View className="flex-row items-start gap-2">
          <Text
            className="min-w-0 flex-1 font-semibold leading-6 text-card-foreground text-sm"
            numberOfLines={2}
          >
            {recipe.title}
          </Text>
        </View>

        <View className="flex-row flex-wrap items-center gap-x-4 gap-y-1">
          <View className="flex-row items-center gap-1.5">
            <UsersRound color={palette.mutedForeground} size={15} />
            <Text className="text-sm text-muted-foreground">
              {recipe.servings}
            </Text>
          </View>

          <View className="flex-row items-center gap-1.5">
            <Clock3 color={palette.mutedForeground} size={15} />
            <Text className="text-sm text-muted-foreground">
              {recipe.cookTime}
            </Text>
          </View>

          <View className="flex-row items-center gap-1.5">
            <ChartNoAxesColumnIncreasing
              color={palette.mutedForeground}
              size={15}
            />
            <Text className="text-sm text-muted-foreground">
              {recipe.difficulty}
            </Text>
          </View>
        </View>
      </View>

      <View className="h-10 w-5 items-center justify-center">
        <ChevronRight color={palette.foreground} size={22} strokeWidth={2.25} />
      </View>
    </Pressable>
  );
}

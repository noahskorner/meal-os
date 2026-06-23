import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { router } from "expo-router";
import { Plus, Search, SlidersHorizontal } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Recipe } from "./recipe";
import { RecipeCard } from "./recipe-card";

const recipes: Recipe[] = [
  {
    id: "herby-chicken-bowls",
    title: "Herby Chicken Bowls",
    category: "Dinner",
    cookTime: "35 min",
    servings: "4 servings",
    difficulty: "Easy",
    accent: "brand",
  },
  {
    id: "tomato-basil-pasta",
    title: "Tomato Basil Pasta",
    category: "Weeknight",
    cookTime: "25 min",
    servings: "3 servings",
    difficulty: "Easy",
    accent: "secondary",
  },
  {
    id: "citrus-salmon-plate",
    title: "Citrus Salmon Plate",
    category: "Fresh",
    cookTime: "30 min",
    servings: "2 servings",
    difficulty: "Medium",
    accent: "muted",
  },
];

const filters = ["All", "Breakfast", "Lunch", "Dinner", "Saved"];

export function ListRecipesScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const palette = colorScheme === "dark" ? THEME.dark : THEME.light;

  return (
    <View className="flex-1 bg-background">
      <View
        className="border-b border-border bg-background px-5 pb-4"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="flex-row items-center justify-between gap-4">
          <Text className="mt-1 text-3xl font-bold leading-9 text-foreground">
            My Recipes
          </Text>

          <Button
            accessibilityLabel="Add recipe"
            className="rounded-full"
            size="icon"
            variant="brand"
            onPress={() => router.push("/recipes/add")}
          >
            <Plus color={palette.brandForeground} size={22} strokeWidth={2.5} />
          </Button>
        </View>

        <View className="mt-5 flex-row items-center gap-3">
          <View className="h-12 flex-1 flex-row items-center gap-3 rounded-lg border border-input bg-card px-4">
            <Search color={palette.mutedForeground} size={18} />
            <TextInput
              className="min-w-0 flex-1 text-base text-foreground"
              placeholder="Search recipes"
              placeholderTextColor={palette.mutedForeground}
              returnKeyType="search"
            />
          </View>

          <Pressable
            accessibilityLabel="Filter recipes"
            className="h-12 w-12 items-center justify-center rounded-lg border border-border bg-card"
          >
            <SlidersHorizontal color={palette.foreground} size={19} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingTop: 18,
          paddingBottom: insets.bottom + 28,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          className="-mx-5"
          contentContainerStyle={{
            gap: 10,
            paddingHorizontal: 20,
            paddingBottom: 18,
          }}
          showsHorizontalScrollIndicator={false}
        >
          {filters.map((filter, index) => (
            <Pressable
              key={filter}
              className={`rounded-full border px-4 py-2 ${
                index === 0 ? "border-brand bg-brand" : "border-border bg-card"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  index === 0
                    ? "text-brand-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {filter}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View className="gap-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { router } from "expo-router";
import { Plus, SlidersHorizontal } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RecipeCard } from "./recipe-card";
import { useListRecipes } from "./use-list-recipes";

const filters = ["All", "Breakfast", "Lunch", "Dinner", "Saved"];

export function ListRecipesScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const palette = colorScheme === "dark" ? THEME.dark : THEME.light;
  const {
    query,
    recipes,
    isInitialLoading,
    isLoadingMore,
    isRefreshing,
    isSearching,
    error,
    emptyStateMessage,
    searchRecipes,
    clearSearch,
    refreshRecipes,
    loadNextPage,
    openRecipe,
  } = useListRecipes();

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
            onPress={() => router.push("/recipes/new")}
          >
            <Plus color={palette.brandForeground} size={22} strokeWidth={2.5} />
          </Button>
        </View>

        <View className="mt-5 flex-row items-center gap-3">
          <SearchInput
            value={query}
            onChangeText={searchRecipes}
            onClear={clearSearch}
            isLoading={isSearching}
            containerClassName="flex-1"
            inputClassName="h-12 text-base"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Search recipes"
            returnKeyType="search"
          />
        </View>
      </View>

      <FlatList
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingTop: 18,
          paddingBottom: insets.bottom + 28,
        }}
        data={recipes}
        keyExtractor={(recipe) => recipe.id}
        ListHeaderComponent={<RecipeFilters />}
        ListEmptyComponent={
          <RecipeListEmptyState
            error={error}
            emptyMessage={emptyStateMessage}
            isLoading={isInitialLoading}
            onRetry={refreshRecipes}
          />
        }
        ListFooterComponent={
          isLoadingMore ? (
            <View className="py-4">
              <ActivityIndicator color={palette.brand} />
            </View>
          ) : null
        }
        refreshing={isRefreshing}
        renderItem={({ item }) => (
          <View className="mb-3">
            <RecipeCard recipe={item} onPress={openRecipe} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.35}
        onRefresh={refreshRecipes}
      />
    </View>
  );
}

function RecipeFilters() {
  return (
    <FlatList
      horizontal
      className="-mx-5"
      contentContainerStyle={{
        gap: 10,
        paddingHorizontal: 20,
        paddingBottom: 18,
      }}
      data={filters}
      keyExtractor={(filter) => filter}
      renderItem={({ item, index }) => (
        <Pressable
          className={`rounded-full border px-4 py-2 ${
            index === 0 ? "border-brand bg-brand" : "border-border bg-card"
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              index === 0 ? "text-brand-foreground" : "text-muted-foreground"
            }`}
          >
            {item}
          </Text>
        </Pressable>
      )}
      showsHorizontalScrollIndicator={false}
    />
  );
}

function RecipeListEmptyState({
  error,
  emptyMessage,
  isLoading,
  onRetry,
}: {
  error: string | null;
  emptyMessage: string;
  isLoading: boolean;
  onRetry: () => void;
}) {
  if (isLoading) {
    return (
      <View className="items-center justify-center py-16">
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center justify-center gap-4 py-16">
        <Text className="text-center text-muted-foreground">{error}</Text>
        <Button variant="brand-outline" onPress={onRetry}>
          <Text>Try again</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="items-center justify-center py-16">
      <Text className="text-center text-muted-foreground">{emptyMessage}</Text>
    </View>
  );
}

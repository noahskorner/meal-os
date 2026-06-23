import { webApiClient } from "@/lib/web-api-client";
import { listRecipes, type ListRecipeResponse } from "@repo/web-api-client";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

const pageSize = 20;

export function useListRecipes() {
  const [recipes, setRecipes] = useState<ListRecipeResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const isLoadingRef = useRef(false);

  const loadRecipes = useCallback(
    async (nextPage: number, options?: { replace?: boolean }) => {
      if (isLoadingRef.current) {
        return;
      }

      const replace = options?.replace ?? false;
      isLoadingRef.current = true;

      if (replace) {
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const { data, error } = await listRecipes({
          client: webApiClient,
          query: {
            page: nextPage,
            pageSize,
          },
        });

        if (!isMountedRef.current) {
          return;
        }

        if (error || !data) {
          setError("Unable to load recipes.");
          return;
        }

        setRecipes((current) =>
          replace ? data.items : [...current, ...data.items],
        );
        setPage(data.page);
        setTotalPages(data.totalPages);
        setError(null);
      } catch (e) {
        console.error("Error loading recipes:", e);

        if (isMountedRef.current) {
          setError("Unable to load recipes.");
        }
      } finally {
        if (isMountedRef.current) {
          setIsInitialLoading(false);
          setIsLoadingMore(false);
          setIsRefreshing(false);
        }

        isLoadingRef.current = false;
      }
    },
    [],
  );

  const refreshRecipes = useCallback(() => {
    if (isLoadingRef.current) {
      return;
    }

    if (recipes.length === 0) {
      setIsInitialLoading(true);
    }

    setIsRefreshing(true);
    void loadRecipes(1, { replace: true });
  }, [loadRecipes, recipes.length]);

  const loadNextPage = useCallback(() => {
    if (
      isInitialLoading ||
      isLoadingMore ||
      isLoadingRef.current ||
      page >= totalPages
    ) {
      return;
    }

    void loadRecipes(page + 1);
  }, [isInitialLoading, isLoadingMore, loadRecipes, page, totalPages]);

  const openRecipe = useCallback((recipe: ListRecipeResponse) => {
    router.push(`/recipes/${recipe.id}`);
  }, []);

  useEffect(() => {
    void loadRecipes(1, { replace: true });
  }, [loadRecipes]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    recipes,
    isInitialLoading,
    isLoadingMore,
    isRefreshing,
    error,
    refreshRecipes,
    loadNextPage,
    openRecipe,
  };
}

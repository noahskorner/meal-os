import { webApiClient } from "@/lib/web-api-client";
import { listRecipes, type ListRecipeResponse } from "@repo/web-api-client";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

const pageSize = 20;

type LoadRecipesOptions = {
  replace?: boolean;
  reason?: "initial" | "refresh" | "search";
  searchTerm?: string;
};

export function useListRecipes() {
  const [recipes, setRecipes] = useState<ListRecipeResponse[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const hasLoadedOnceRef = useRef(false);
  const isLoadingMoreRef = useRef(false);
  const currentQueryRef = useRef("");
  const replaceRequestIdRef = useRef(0);
  const datasetVersionRef = useRef(0);

  const loadRecipes = useCallback(
    async (nextPage: number, options?: LoadRecipesOptions) => {
      const replace = options?.replace ?? false;
      const normalizedSearchTerm = (
        options?.searchTerm ?? currentQueryRef.current
      ).trim();
      let replaceRequestId = 0;
      let datasetVersion = datasetVersionRef.current;

      if (replace) {
        replaceRequestId = replaceRequestIdRef.current + 1;
        replaceRequestIdRef.current = replaceRequestId;
        datasetVersionRef.current += 1;
        datasetVersion = datasetVersionRef.current;
        setError(null);
        if (options?.reason === "refresh") {
          setIsRefreshing(true);
        } else if (!hasLoadedOnceRef.current) {
          setIsInitialLoading(true);
        } else {
          setIsSearching(true);
        }
      } else {
        if (isLoadingMoreRef.current) {
          return;
        }

        isLoadingMoreRef.current = true;
        setIsLoadingMore(true);
      }

      try {
        const { data, error } = await listRecipes({
          client: webApiClient,
          query: {
            page: nextPage,
            pageSize,
            ...(normalizedSearchTerm ? { searchTerm: normalizedSearchTerm } : {}),
          },
        });

        if (!isMountedRef.current) {
          return;
        }

        if (
          (replace && replaceRequestIdRef.current !== replaceRequestId) ||
          datasetVersionRef.current !== datasetVersion
        ) {
          return;
        }

        if (error || !data) {
          if (replace && options?.reason !== "refresh") {
            setRecipes([]);
            setPage(1);
            setTotalPages(1);
          }

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

        if (
          !isMountedRef.current ||
          (replace && replaceRequestIdRef.current !== replaceRequestId) ||
          datasetVersionRef.current !== datasetVersion
        ) {
          return;
        }

        if (replace && options?.reason !== "refresh") {
          setRecipes([]);
          setPage(1);
          setTotalPages(1);
        }

        setError("Unable to load recipes.");
      } finally {
        if (replace) {
          if (
            isMountedRef.current &&
            replaceRequestIdRef.current === replaceRequestId
          ) {
            hasLoadedOnceRef.current = true;
            setIsInitialLoading(false);
            setIsRefreshing(false);
            setIsSearching(false);
          }
        } else {
          if (isMountedRef.current) {
            setIsLoadingMore(false);
          }

          isLoadingMoreRef.current = false;
        }
      }
    },
    [],
  );

  const refreshRecipes = useCallback(() => {
    if (recipes.length === 0) {
      setIsInitialLoading(true);
    }

    void loadRecipes(1, { replace: true, reason: "refresh" });
  }, [loadRecipes, recipes.length]);

  const loadNextPage = useCallback(() => {
    if (
      isInitialLoading ||
      isLoadingMore ||
      isSearching ||
      page >= totalPages
    ) {
      return;
    }

    void loadRecipes(page + 1);
  }, [isInitialLoading, isLoadingMore, isSearching, loadRecipes, page, totalPages]);

  const searchRecipes = useCallback(
    (searchTerm: string) => {
      currentQueryRef.current = searchTerm;
      setQuery(searchTerm);
      void loadRecipes(1, {
        replace: true,
        reason: "search",
        searchTerm,
      });
    },
    [loadRecipes],
  );

  const clearSearch = useCallback(() => {
    currentQueryRef.current = "";
    setQuery("");
    void loadRecipes(1, {
      replace: true,
      reason: "search",
      searchTerm: "",
    });
  }, [loadRecipes]);

  const openRecipe = useCallback((recipe: ListRecipeResponse) => {
    router.push(`/recipes/${recipe.id}`);
  }, []);

  useEffect(() => {
    void loadRecipes(1, { replace: true, reason: "initial", searchTerm: "" });
  }, [loadRecipes]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    query,
    recipes,
    isInitialLoading,
    isLoadingMore,
    isRefreshing,
    isSearching,
    error,
    emptyStateMessage: query.trim()
      ? "No recipes match your search."
      : "No recipes yet.",
    searchRecipes,
    clearSearch,
    refreshRecipes,
    loadNextPage,
    openRecipe,
  };
}

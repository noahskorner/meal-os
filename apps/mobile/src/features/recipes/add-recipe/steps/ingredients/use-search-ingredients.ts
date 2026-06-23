import { webApiClient } from "@/lib/web-api-client";
import {
  listIngredients,
  type ListIngredientResponse,
} from "@repo/web-api-client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createIngredient,
  type RecipeIngredient,
  updateSortOrder,
} from "./ingredient-data";

const pageSize = 20;

export function useSearchIngredients() {
  const [ingredients, setIngredients] = useState<ListIngredientResponse[]>([]);
  const [recipeIngredients, setRecipeIngredients] = useState<
    RecipeIngredient[]
  >([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);

  const addedIds = useMemo(
    () => new Set(recipeIngredients.map((ingredient) => ingredient.id)),
    [recipeIngredients],
  );

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return ingredients.filter((ingredient) => !addedIds.has(ingredient.id));
    }

    return ingredients.filter(
      (ingredient) =>
        !addedIds.has(ingredient.id) &&
        ingredient.name.toLowerCase().includes(normalizedQuery),
    );
  }, [addedIds, ingredients, query]);

  const hasExactMatch = ingredients.some(
    (ingredient) =>
      ingredient.name.toLowerCase() === query.trim().toLowerCase(),
  );

  const loadIngredients = useCallback(async (searchTerm = "") => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoading(true);
    setError(null);

    try {
      const normalizedSearchTerm = searchTerm.trim();
      const { data, error } = await listIngredients({
        client: webApiClient,
        query: {
          page: 1,
          pageSize,
          ...(normalizedSearchTerm ? { searchTerm: normalizedSearchTerm } : {}),
        },
      });

      if (!isMountedRef.current || requestIdRef.current !== requestId) {
        return;
      }

      if (error || !data) {
        setIngredients([]);
        setError("Unable to load ingredients.");
        return;
      }

      setIngredients(data.items);
    } catch (e) {
      console.error("Error loading ingredients:", JSON.stringify(e, null, 2));
      if (!isMountedRef.current || requestIdRef.current !== requestId) {
        return;
      }

      setIngredients([]);
      setError("Unable to load ingredients.");
    } finally {
      if (isMountedRef.current && requestIdRef.current === requestId) {
        setIsLoading(false);
      }
    }
  }, []);

  const searchIngredients = useCallback(
    (searchTerm: string) => {
      setQuery(searchTerm);
      void loadIngredients(searchTerm);
    },
    [loadIngredients],
  );

  const clearIngredients = useCallback(() => {
    requestIdRef.current += 1;
    setIngredients([]);
    setQuery("");
    setError(null);
    setIsLoading(false);
  }, []);

  const addIngredient = useCallback((ingredient: ListIngredientResponse) => {
    setRecipeIngredients((current) =>
      updateSortOrder([
        ...current,
        { ...ingredient, sortOrder: current.length },
      ]),
    );
  }, []);

  const createNewIngredient = useCallback(() => {
    const name = query.trim();

    if (!name) {
      return;
    }

    addIngredient(createIngredient(name));
    clearIngredients();
  }, [addIngredient, clearIngredients, query]);

  const removeIngredient = useCallback((id: string) => {
    setRecipeIngredients((current) =>
      updateSortOrder(current.filter((ingredient) => ingredient.id !== id)),
    );
  }, []);

  const clearRecipeIngredients = useCallback(() => {
    setRecipeIngredients([]);
  }, []);

  useEffect(() => {
    void loadIngredients();
  }, [loadIngredients]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      requestIdRef.current += 1;
    };
  }, []);

  return {
    recipeIngredients,
    results,
    query,
    hasExactMatch,
    isLoading,
    error,
    searchIngredients,
    clearIngredients,
    addIngredient,
    createNewIngredient,
    removeIngredient,
    clearRecipeIngredients,
  };
}

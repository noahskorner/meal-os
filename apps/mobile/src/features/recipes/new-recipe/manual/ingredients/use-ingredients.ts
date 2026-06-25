import { webApiClient } from "@/lib/web-api-client";
import { useCallback, useEffect, useRef, useState } from "react";

const pageSize = 20;

type BaseListIngredientResponse = {
  name: string;
};

type ListIngredientsApiResponse<
  TIngredient extends BaseListIngredientResponse,
> = {
  data?: {
    items: TIngredient[];
  };
  error?: unknown;
};

type ListIngredientsApi<TIngredient extends BaseListIngredientResponse> =
  (options: {
    client: typeof webApiClient;
    query: {
      page: number;
      pageSize: number;
      searchTerm?: string;
    };
  }) => Promise<ListIngredientsApiResponse<TIngredient>>;

type UseIngredientsParams<TIngredient extends BaseListIngredientResponse> = {
  listIngredients: ListIngredientsApi<TIngredient>;
};

export function useIngredients<TIngredient extends BaseListIngredientResponse>({
  listIngredients,
}: UseIngredientsParams<TIngredient>) {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);

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

  const hasExactMatch = ingredients.some(
    (ingredient) =>
      ingredient.name.toLowerCase() === query.trim().toLowerCase(),
  );

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
    query,
    ingredients,
    isLoading,
    error,
    hasExactMatch,
    searchIngredients,
    clearIngredients,
  };
}

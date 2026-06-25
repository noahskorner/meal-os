import { webApiClient } from "@/lib/web-api-client";
import {
  listIngredientCategories,
  type ListIngredientCategoriesResponse,
} from "@repo/web-api-client";
import * as React from "react";

type IngredientCategoriesContextValue = {
  ingredientCategories: ListIngredientCategoriesResponse;
  isLoading: boolean;
};

const IngredientCategoriesContext = React.createContext<
  IngredientCategoriesContextValue | undefined
>(undefined);

let cachedIngredientCategories: ListIngredientCategoriesResponse | null = null;
let ingredientCategoriesRequest: Promise<ListIngredientCategoriesResponse> | null =
  null;

async function loadIngredientCategories() {
  if (cachedIngredientCategories) {
    return cachedIngredientCategories;
  }

  if (!ingredientCategoriesRequest) {
    ingredientCategoriesRequest = listIngredientCategories({
      client: webApiClient,
    })
      .then(({ data, error }) => {
        if (error || !data) {
          throw new Error("Unable to load ingredient categories.");
        }

        cachedIngredientCategories = data;
        return data;
      })
      .catch((error: unknown) => {
        ingredientCategoriesRequest = null;
        throw error;
      });
  }

  return ingredientCategoriesRequest;
}

export function IngredientCategoriesProvider({
  children,
}: React.PropsWithChildren) {
  const [ingredientCategories, setIngredientCategories] =
    React.useState<ListIngredientCategoriesResponse>(
      cachedIngredientCategories ?? [],
    );
  const [isLoading, setIsLoading] = React.useState(
    cachedIngredientCategories === null,
  );

  React.useEffect(() => {
    if (cachedIngredientCategories) {
      return;
    }

    let isMounted = true;

    void loadIngredientCategories()
      .then((nextIngredientCategories) => {
        if (!isMounted) {
          return;
        }

        setIngredientCategories(nextIngredientCategories);
      })
      .catch((error: unknown) => {
        console.error("Error loading ingredient categories:", error);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const value = React.useMemo<IngredientCategoriesContextValue>(
    () => ({
      ingredientCategories,
      isLoading,
    }),
    [ingredientCategories, isLoading],
  );

  return React.createElement(
    IngredientCategoriesContext.Provider,
    { value },
    children,
  );
}

export function useIngredientCategories() {
  const value = React.useContext(IngredientCategoriesContext);

  if (!value) {
    throw new Error(
      "useIngredientCategories must be used within an IngredientCategoriesProvider.",
    );
  }

  return value;
}

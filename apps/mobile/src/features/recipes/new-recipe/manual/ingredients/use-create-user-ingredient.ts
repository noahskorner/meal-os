import { webApiClient } from "@/lib/web-api-client";
import {
  createUserIngredient,
  type CreateUserIngredientRequest,
  type CreateUserIngredientResponse,
} from "@repo/web-api-client";
import * as React from "react";

export type CreatedUserIngredient = CreateUserIngredientResponse &
  CreateUserIngredientRequest;

export function useCreateUserIngredient() {
  const [error, setError] = React.useState<string | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);

  const reset = React.useCallback(() => {
    setError(null);
    setIsCreating(false);
  }, []);

  const createIngredient = React.useCallback(
    async (
      ingredient: CreateUserIngredientRequest,
    ): Promise<CreatedUserIngredient> => {
      setIsCreating(true);
      setError(null);

      try {
        const { data, error: createError } = await createUserIngredient({
          client: webApiClient,
          body: ingredient,
        });

        if (createError || !data) {
          throw new Error("Unable to create ingredient.");
        }

        return {
          ...data,
          ...ingredient,
        };
      } catch (createError) {
        console.error("Error creating user ingredient:", createError);
        setError("Unable to create ingredient.");
        throw createError;
      } finally {
        setIsCreating(false);
      }
    },
    [],
  );

  return {
    createIngredient,
    error,
    isCreating,
    reset,
  };
}

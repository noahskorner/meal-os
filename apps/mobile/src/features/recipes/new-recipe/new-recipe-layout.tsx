import { ReactNode } from "react";
import { NewRecipeProvider } from "./use-new-recipe";

export function NewRecipeLayout({ children }: { children: ReactNode }) {
  return <NewRecipeProvider>{children}</NewRecipeProvider>;
}

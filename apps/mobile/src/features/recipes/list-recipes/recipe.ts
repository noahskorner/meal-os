export type Recipe = {
  id: string;
  title: string;
  category: string;
  cookTime: string;
  servings: string;
  difficulty: string;
  accent: "brand" | "secondary" | "muted";
};

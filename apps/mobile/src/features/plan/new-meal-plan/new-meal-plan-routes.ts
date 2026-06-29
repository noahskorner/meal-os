import { type Href } from "expo-router";

export const newMealPlanRoutes = {
  plan: "/plan" as Href,
  start: "/plans/new" as Href,
  details: "/plans/new/details" as Href,
  entries: "/plans/new/entries" as Href,
  review: "/plans/new/review" as Href,
  entryDate: (date: string) =>
    ({
      pathname: "/plans/new/entries/[date]",
      params: { date },
    }) as unknown as Href,
} as const;

import { z } from "../../../lib/zod";

const createMealPlanEntryRequestSchema = z
  .object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format.")
      .openapi({
        example: "2026-07-01",
      }),
    recipeIds: z.array(z.uuid()).optional().openapi({
      example: [
        "550e8400-e29b-41d4-a716-446655440000",
        "550e8400-e29b-41d4-a716-446655440001",
      ],
    }),
  })
  .openapi("CreateMealPlanEntryRequest");

export const createMealPlanRequestSchema = z
  .object({
    entries: z
      .array(createMealPlanEntryRequestSchema)
      .min(1)
      .openapi({
        example: [
          {
            date: "2026-07-01",
            recipeIds: [
              "550e8400-e29b-41d4-a716-446655440000",
              "550e8400-e29b-41d4-a716-446655440001",
            ],
          },
          {
            date: "2026-07-02",
          },
        ],
      }),
  })
  .superRefine((request, context) => {
    const seenDates = new Set<string>();

    request.entries.forEach((entry, index) => {
      if (!seenDates.has(entry.date)) {
        seenDates.add(entry.date);
        return;
      }

      context.addIssue({
        code: "custom",
        message: "Each meal plan entry date must be unique.",
        path: ["entries", index, "date"],
      });
    });
  })
  .openapi("CreateMealPlanRequest");

export type CreateMealPlanRequest = z.infer<typeof createMealPlanRequestSchema>;

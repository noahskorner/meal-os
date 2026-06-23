import { PrismaClient } from "@repo/db";
import type { ListIngredientsModel } from "./list-ingredients.model";

export type FindManyIngredientsParams = {
  skip: number;
  take: number;
  searchTerm?: string;
};

type IngredientIdRow = {
  id: string;
};

type IngredientCountRow = {
  count: bigint;
};

export class ListIngredientsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findMany(
    params: FindManyIngredientsParams,
  ): Promise<ListIngredientsModel[]> {
    const ids = params.searchTerm
      ? await this.findMatchingIds({
          ...params,
          searchTerm: params.searchTerm,
        })
      : (
          await this.prisma.ingredient.findMany({
            orderBy: { name: "asc" },
            skip: params.skip,
            take: params.take,
            select: { id: true },
          })
        ).map(({ id }) => id);

    if (ids.length === 0) {
      return [];
    }

    const ingredients = await this.prisma.ingredient.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        name: true,
        aliases: {
          orderBy: {
            alias: "asc",
          },
          select: {
            alias: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        defaultUnit: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
            type: true,
          },
        },
      },
    });
    const ingredientsById = new Map(
      ingredients.map((ingredient) => [
        ingredient.id,
        {
          id: ingredient.id,
          name: ingredient.name,
          aliases: ingredient.aliases.map(({ alias }) => alias),
          category: ingredient.category,
          defaultUnit: {
            ...ingredient.defaultUnit,
            type: ingredient.defaultUnit.type,
          },
        },
      ]),
    );

    return ids.map((id) => ingredientsById.get(id)!);
  }

  public async count(searchTerm?: string): Promise<number> {
    if (!searchTerm) {
      return this.prisma.ingredient.count();
    }

    const containsPattern = this.createContainsPattern(searchTerm);
    const [result] = await this.prisma.$queryRaw<IngredientCountRow[]>`
      SELECT COUNT(*) AS "count"
      FROM "ingredients" i
      WHERE
        i."name" ILIKE ${containsPattern} ESCAPE '\\'
        OR i."name" % ${searchTerm}
        OR ${searchTerm} <% i."name"
        OR EXISTS (
          SELECT 1
          FROM "ingredient_aliases" ia
          WHERE ia."ingredient_id" = i."id"
            AND (
              ia."alias" ILIKE ${containsPattern} ESCAPE '\\'
              OR ia."alias" % ${searchTerm}
              OR ${searchTerm} <% ia."alias"
            )
        )
    `;

    return Number(result?.count ?? 0);
  }

  private async findMatchingIds(
    params: FindManyIngredientsParams & { searchTerm: string },
  ): Promise<string[]> {
    const { searchTerm } = params;
    const containsPattern = this.createContainsPattern(searchTerm);
    const rows = await this.prisma.$queryRaw<IngredientIdRow[]>`
      SELECT i."id"
      FROM "ingredients" i
      LEFT JOIN "ingredient_aliases" ia ON ia."ingredient_id" = i."id"
      WHERE
        i."name" ILIKE ${containsPattern} ESCAPE '\\'
        OR i."name" % ${searchTerm}
        OR ${searchTerm} <% i."name"
        OR ia."alias" ILIKE ${containsPattern} ESCAPE '\\'
        OR ia."alias" % ${searchTerm}
        OR ${searchTerm} <% ia."alias"
      GROUP BY i."id", i."name"
      ORDER BY
        MAX(
          CASE
            WHEN LOWER(i."name") = LOWER(${searchTerm}) THEN 4
            WHEN LOWER(ia."alias") = LOWER(${searchTerm}) THEN 3
            WHEN i."name" ILIKE ${containsPattern} ESCAPE '\\' THEN 2
            WHEN ia."alias" ILIKE ${containsPattern} ESCAPE '\\' THEN 1
            ELSE 0
          END
        ) DESC,
        GREATEST(
          similarity(i."name", ${searchTerm}),
          word_similarity(${searchTerm}, i."name"),
          COALESCE(MAX(similarity(ia."alias", ${searchTerm})), 0),
          COALESCE(MAX(word_similarity(${searchTerm}, ia."alias")), 0)
        ) DESC,
        i."name" ASC
      LIMIT ${params.take}
      OFFSET ${params.skip}
    `;

    return rows.map(({ id }) => id);
  }

  private createContainsPattern(searchTerm: string): string {
    const escapedSearchTerm = searchTerm.replace(/[\\%_]/g, "\\$&");

    return `%${escapedSearchTerm}%`;
  }
}

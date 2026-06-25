import { PrismaClient } from "@repo/db";
import type { ListRecipeModel } from "./list-recipes.model";

export type FindManyRecipesParams = {
  createdById: string;
  searchTerm?: string;
  skip: number;
  take: number;
};

type RecipeIdRow = {
  id: string;
};

type RecipeCountRow = {
  count: bigint;
};

export class ListRecipesRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findMany(
    params: FindManyRecipesParams,
  ): Promise<ListRecipeModel[]> {
    const ids = params.searchTerm
      ? await this.findMatchingIds({
          ...params,
          searchTerm: params.searchTerm,
        })
      : (
          await this.prisma.recipe.findMany({
            where: {
              createdById: params.createdById,
            },
            orderBy: {
              name: "asc",
            },
            skip: params.skip,
            take: params.take,
            select: {
              id: true,
            },
          })
        ).map(({ id }) => id);

    if (ids.length === 0) {
      return [];
    }

    const recipes = await this.prisma.recipe.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        prepTimeMinutes: true,
        cookTimeMinutes: true,
        servings: true,
      },
    });
    const recipesById = new Map(
      recipes.map((recipe) => [
        recipe.id,
        {
          id: recipe.id,
          name: recipe.name,
          description: recipe.description ?? undefined,
          prepTimeMinutes: recipe.prepTimeMinutes ?? undefined,
          cookTimeMinutes: recipe.cookTimeMinutes ?? undefined,
          servings: recipe.servings ?? undefined,
        },
      ]),
    );

    return ids.map((id) => recipesById.get(id)!);
  }

  public async count(params: {
    createdById: string;
    searchTerm?: string;
  }): Promise<number> {
    if (!params.searchTerm) {
      return this.prisma.recipe.count({
        where: {
          createdById: params.createdById,
        },
      });
    }

    const containsPattern = this.createContainsPattern(params.searchTerm);
    const [result] = await this.prisma.$queryRaw<RecipeCountRow[]>`
      SELECT COUNT(*) AS "count"
      FROM "recipes" r
      WHERE
        r."created_by_id" = ${params.createdById}
        AND (
          r."name" ILIKE ${containsPattern} ESCAPE '\\'
          OR r."name" % ${params.searchTerm}
          OR ${params.searchTerm} <% r."name"
          OR similarity(r."name", ${params.searchTerm}) >= 0.2
          OR word_similarity(${params.searchTerm}, r."name") >= 0.3
        )
    `;

    return Number(result?.count ?? 0);
  }

  private async findMatchingIds(
    params: FindManyRecipesParams & { searchTerm: string },
  ): Promise<string[]> {
    const containsPattern = this.createContainsPattern(params.searchTerm);
    const rows = await this.prisma.$queryRaw<RecipeIdRow[]>`
      SELECT r."id"
      FROM "recipes" r
      WHERE
        r."created_by_id" = ${params.createdById}
        AND (
          r."name" ILIKE ${containsPattern} ESCAPE '\\'
          OR r."name" % ${params.searchTerm}
          OR ${params.searchTerm} <% r."name"
          OR similarity(r."name", ${params.searchTerm}) >= 0.2
          OR word_similarity(${params.searchTerm}, r."name") >= 0.3
        )
      ORDER BY
        CASE
          WHEN LOWER(r."name") = LOWER(${params.searchTerm}) THEN 3
          WHEN r."name" ILIKE ${containsPattern} ESCAPE '\\' THEN 2
          ELSE 0
        END DESC,
        GREATEST(
          similarity(r."name", ${params.searchTerm}),
          word_similarity(${params.searchTerm}, r."name")
        ) DESC,
        r."name" ASC
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

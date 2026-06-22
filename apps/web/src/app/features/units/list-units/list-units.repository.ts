import { PrismaClient } from "@repo/db";
import type { ListUnitsModel } from "./list-units.model";

export class ListUnitsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findMany(): Promise<ListUnitsModel[]> {
    return this.prisma.unit.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        abbreviation: true,
        type: true,
      },
    });
  }
}

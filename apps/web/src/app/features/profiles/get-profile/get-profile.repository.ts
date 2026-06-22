import { PrismaClient } from "@repo/db";
import type { GetProfileModel } from "./get-profile.model";

export class GetProfileRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findById(id: string): Promise<GetProfileModel | null> {
    return this.prisma.profile.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });
  }
}

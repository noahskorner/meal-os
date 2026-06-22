import { prisma } from "@repo/db";
import { GetProfileModel } from "./get-profile.model";

export async function findProfileById(
  id: string,
): Promise<GetProfileModel | null> {
  return prisma.profile.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });
}

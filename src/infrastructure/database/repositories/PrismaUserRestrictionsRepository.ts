import { IUserRestrictionsRepository } from '../../../domain/repositories/IUserRestrictionsRepository';
import { PrismaClient } from '@prisma/client';

export class PrismaUserRestrictionsRepository implements IUserRestrictionsRepository {
  private prisma = new PrismaClient();

  async getRestrictionsByUserId(userId: string): Promise<any | null> {
    const result = await this.prisma.userRestrictions.findUnique({ where: { userId: userId } });
    return result;
  }
} 
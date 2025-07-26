import { PrismaClient } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { UserPreferences } from '../../../domain/entities/UserPreferences';
import { IUserPreferencesRepository } from '../../../domain/repositories/IUserPreferencesRepository';

@injectable()
export class PrismaUserPreferencesRepository implements IUserPreferencesRepository {
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async findByUserId(userId: string): Promise<UserPreferences | null> {
    const record = await this.prisma.userPreferences.findUnique({ where: { userId: userId } });
    if (!record) return null;
    return new UserPreferences(
      record.id,
      record.userId,
      record.darkMode,
      record.fontSize.toString(),
      record.soundEnabled,
      record.pushNotifications,
      record.emailNotifications,
      record.marketingEmails,
      record.dataCollectionConsent,
      record.accessibilityFeatures,
      record.createdAt,
      record.updatedAt,
    );
  }

  async updateUserPreferences(userId: string, preferencesData: any): Promise<any> {
    const updated = await this.prisma.userPreferences.update({
      where: { userId: userId },
      data: preferencesData,
    });
    return updated;
  }
}

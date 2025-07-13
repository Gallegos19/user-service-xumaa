import { UserPreferencesCommandPort } from '../ports/input/UserPreferencesCommandPort';
import { inject, injectable } from 'inversify';
import { PrismaUserPreferencesRepository } from '../../infrastructure/database/repositories/PrismaUserPreferencesRepository';

@injectable()
export class UserPreferencesCommandService implements UserPreferencesCommandPort {
  constructor(
    @inject('IUserPreferencesRepository') private readonly repo: PrismaUserPreferencesRepository
  ) {}

  async updateUserPreferences(userId: string, preferencesData: any): Promise<any> {
    return this.repo.updateUserPreferences(userId, preferencesData);
  }
} 
import { UserPreferences } from '../entities/UserPreferences';

export interface IUserPreferencesRepository {
  findByUserId(userId: string): Promise<UserPreferences | null>;
} 
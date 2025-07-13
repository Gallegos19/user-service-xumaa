import { UserPreferences } from '../../../domain/entities/UserPreferences';

export interface UserPreferencesQueryPort {
  getUserPreferences(userId: string): Promise<UserPreferences | null>;
}  
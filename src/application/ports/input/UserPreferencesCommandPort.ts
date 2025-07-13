export interface UserPreferencesCommandPort {
  updateUserPreferences(userId: string, preferencesData: any): Promise<any>;
} 
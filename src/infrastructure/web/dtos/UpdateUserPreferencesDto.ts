export interface UpdateUserPreferencesDto {
  darkMode?: boolean;
  fontSize?: string;
  soundEnabled?: boolean;
  pushNotifications?: boolean;
  emailNotifications?: boolean;
  marketingEmails?: boolean;
  dataCollectionConsent?: boolean;
  accessibilityFeatures?: Record<string, any>;
} 
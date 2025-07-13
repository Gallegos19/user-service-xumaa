export class UserPreferences {
  constructor(
    private readonly id: string,
    private readonly userId: string,
    private darkMode: boolean = false,
    private fontSize: string = 'medium',
    private soundEnabled: boolean = true,
    private pushNotifications: boolean = true,
    private emailNotifications: boolean = true,
    private marketingEmails: boolean = false,
    private dataCollectionConsent: boolean = false,
    private accessibilityFeatures: any = {},
    private readonly createdAt: Date = new Date(),
    private readonly updatedAt: Date = new Date()
  ) {}

  public getId(): string { return this.id; }
  public getUserId(): string { return this.userId; }
  public getDarkMode(): boolean { return this.darkMode; }
  public getFontSize(): string { return this.fontSize; }
  public getSoundEnabled(): boolean { return this.soundEnabled; }
  public getPushNotifications(): boolean { return this.pushNotifications; }
  public getEmailNotifications(): boolean { return this.emailNotifications; }
  public getMarketingEmails(): boolean { return this.marketingEmails; }
  public getDataCollectionConsent(): boolean { return this.dataCollectionConsent; }
  public getAccessibilityFeatures(): any { return this.accessibilityFeatures; }
  public getCreatedAt(): Date { return this.createdAt; }
  public getUpdatedAt(): Date { return this.updatedAt; }
} 
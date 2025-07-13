export interface IUserRestrictionsRepository {
  getRestrictionsByUserId(userId: string): Promise<any | null>;
} 
import { User } from '../../../domain/entities/User';

export interface UserCommandPort {
  updateUserProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    age?: number;
  }): Promise<User | null>;
} 
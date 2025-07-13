import { User } from '../../../domain/entities/User';

export interface UserCommandPort {
  updateUserProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    age?: number;
  }): Promise<User | null>;
  updateUser(userId: string, userData: Partial<User>): Promise<User | null>;
  deleteUser(userId: string): Promise<boolean>;
}
import { User } from '../../../domain/entities/User';

export interface UserQueryPort {
  getUserProfile(userId: string): Promise<User | null>;
} 
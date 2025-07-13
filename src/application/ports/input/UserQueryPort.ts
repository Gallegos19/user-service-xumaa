import { User } from '../../../domain/entities/User';

export interface UserQueryPort {
  getUserProfile(userId: string): Promise<User | null>;
  getAllUsers(options: { page: number; limit: number }): Promise<{
    users: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>;
}
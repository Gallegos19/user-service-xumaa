import { User } from '../entities/User';
import { Email } from '../value-objects/Email';
import { UserId } from '../value-objects/UserId';

export interface IUserRepository {
  save(user: User): Promise<void>;
  getAllUsers(options: { page: number; limit: number }): Promise<{ users: User[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>;
  updateUser(userId: string, userData: Partial<User>): Promise<User | null>;
  deleteUser(userId: string): Promise<boolean>;
  findById(userId: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findByEmailAndStatus(email: Email, status: string): Promise<User | null>;
  existsByEmail(email: Email): Promise<boolean>;
  updateLastLogin(userId: UserId): Promise<void>;
  countUsers(): Promise<number>;
  findActiveUsers(limit?: number, offset?: number): Promise<User[]>;
}
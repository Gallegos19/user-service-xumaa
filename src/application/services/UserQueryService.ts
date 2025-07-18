import { injectable, inject } from 'inversify';
import { UserQueryPort } from '../ports/input/UserQueryPort';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

@injectable()
export class UserQueryService implements UserQueryPort {
  constructor(
    @inject('IUserRepository') private readonly userRepository: IUserRepository
  ) {}

  async getUserProfile(userId: string): Promise<User | null> {
    return this.userRepository.findById({ value: userId } as any);
  }

  async getAllUsers(options: { page: number; limit: number }): Promise<{
    users: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const result = await this.userRepository.getAllUsers(options);
    const totalPages = Math.ceil(result.pagination.total / options.limit);
    
    return {
      users: result.users,
      pagination: {
        ...result.pagination,
        totalPages
      }
    };
  }
}
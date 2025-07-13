import { injectable, inject } from 'inversify';
import { UserCommandPort } from '../ports/input/UserCommandPort';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { Age } from '../../domain/value-objects/Age';

@injectable()
export class UserCommandService implements UserCommandPort {
  constructor(
    @inject('IUserRepository') private readonly userRepository: IUserRepository
  ) {}

  async updateUserProfile(userId: string, data: { firstName?: string; lastName?: string; age?: number; }): Promise<User | null> {
    const user = await this.userRepository.findById({ value: userId } as any);
    if (!user) return null;
    if (data.firstName !== undefined) (user as any).firstName = data.firstName;
    if (data.lastName !== undefined) (user as any).lastName = data.lastName;
    if (data.age !== undefined) (user as any).age = new Age(data.age);
    await this.userRepository.save(user);
    return user;
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User | null> {
    return this.userRepository.updateUser(userId, userData);
  }

  async deleteUser(userId: string): Promise<boolean> {
    // First check if user exists
    const userExists = await this.userRepository.findById({ value: userId } as any);
    if (!userExists) {
      return false;
    }
    
    // If user exists, proceed with deletion
    return this.userRepository.deleteUser(userId);
  }
}
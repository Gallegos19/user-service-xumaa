import { injectable, inject } from 'inversify';
import { UserAvatarCommandPort } from '../ports/input/UserAvatarCommandPort';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

@injectable()
export class UserAvatarCommandService implements UserAvatarCommandPort {
  constructor(
    @inject('IUserRepository') private readonly userRepository: IUserRepository
  ) {}

  async updateUserAvatar(userId: string, avatarUrl: string): Promise<{ avatarUrl: string } | null> {
    const user = await this.userRepository.findById({ value: userId } as any);
    if (!user) return null;
    (user as any).avatarUrl = avatarUrl;
    await this.userRepository.save(user);
    return { avatarUrl };
  }
} 
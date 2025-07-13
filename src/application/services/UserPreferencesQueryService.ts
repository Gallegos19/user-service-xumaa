import { injectable, inject } from 'inversify';
import { UserPreferencesQueryPort } from '../ports/input/UserPreferencesQueryPort';
import { IUserPreferencesRepository } from '../../domain/repositories/IUserPreferencesRepository';
import { UserPreferences } from '../../domain/entities/UserPreferences';

@injectable()
export class UserPreferencesQueryService implements UserPreferencesQueryPort {
  constructor(
    @inject('IUserPreferencesRepository') private readonly userPreferencesRepository: IUserPreferencesRepository
  ) {}

  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    return this.userPreferencesRepository.findByUserId(userId);
  }
} 
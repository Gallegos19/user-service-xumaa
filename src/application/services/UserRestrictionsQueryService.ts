import { IUserRestrictionsRepository } from '../../domain/repositories/IUserRestrictionsRepository';
import { injectable, inject } from 'inversify';

@injectable()
export class UserRestrictionsQueryService {
  constructor(
    @inject('IUserRestrictionsRepository') private readonly repo: IUserRestrictionsRepository
  ) {}

  async getRestrictionsByUserId(userId: string) {
    return this.repo.getRestrictionsByUserId(userId);
  }
} 
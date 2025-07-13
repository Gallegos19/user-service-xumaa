import { ITutorRelationshipRepository } from '../../domain/repositories/ITutorRelationshipRepository';
import { TutorRelationship } from '../../domain/entities/TutorRelationship';
import { injectable, inject } from 'inversify';

@injectable()
export class TutorRelationshipService {
  constructor(
    @inject('ITutorRelationshipRepository') private readonly repo: ITutorRelationshipRepository
  ) {}

  async createTutorRelationship(tutorUserId: string, minorUserId: string, relationshipType: string): Promise<TutorRelationship> {
    return this.repo.createTutorRelationship({ tutorUserId, minorUserId, relationshipType });
  }

  async approveTutorRelationship(relationshipId: string, approverUserId: string): Promise<TutorRelationship | null> {
    return this.repo.approveTutorRelationship(relationshipId, approverUserId);
  }

  async getRelationshipsByUserId(userId: string): Promise<TutorRelationship[]> {
    return this.repo.getRelationshipsByUserId(userId);
  }
} 
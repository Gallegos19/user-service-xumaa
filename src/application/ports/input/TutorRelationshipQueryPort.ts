import { TutorRelationship } from '../../../domain/entities/TutorRelationship';

export interface TutorRelationshipQueryPort {
  getRelationshipsByUserId(userId: string): Promise<TutorRelationship[]>;
} 
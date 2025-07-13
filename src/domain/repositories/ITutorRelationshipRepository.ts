import { TutorRelationship } from '../entities/TutorRelationship';

export interface ITutorRelationshipRepository {
  createTutorRelationship(data: {
    tutorUserId: string;
    minorUserId: string;
    relationshipType: string;
  }): Promise<TutorRelationship>;
  approveTutorRelationship(relationshipId: string, approverUserId: string): Promise<TutorRelationship | null>;
  getRelationshipsByUserId(userId: string): Promise<TutorRelationship[]>;
  findById(relationshipId: string): Promise<TutorRelationship | null>;
} 
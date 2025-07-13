import { TutorRelationship } from '../../../domain/entities/TutorRelationship';

export interface TutorRelationshipCommandPort {
  createTutorRelationship(tutorUserId: string, minorUserId: string, relationshipType: string): Promise<TutorRelationship>;
  approveTutorRelationship(relationshipId: string, approverUserId: string): Promise<TutorRelationship | null>;
} 

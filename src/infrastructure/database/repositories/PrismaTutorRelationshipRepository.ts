import { ITutorRelationshipRepository } from '../../../domain/repositories/ITutorRelationshipRepository';
import { TutorRelationship } from '../../../domain/entities/TutorRelationship';
import { PrismaClient } from '@prisma/client';

export class PrismaTutorRelationshipRepository implements ITutorRelationshipRepository {
  private prisma = new PrismaClient();

  async createTutorRelationship(data: { tutorUserId: string; minorUserId: string; relationshipType: string; }): Promise<TutorRelationship> {
    const result = await this.prisma.tutorRelationship.create({
      data: {
        tutorUserId: data.tutorUserId,
        minorUserId: data.minorUserId,
        relationshipType: data.relationshipType,
        status: 'pending',
        isActive: false
      }
    });
    return new TutorRelationship(result.id, result.tutorUserId, result.minorUserId, result.relationshipType, result.status, result.isActive, result.createdAt, result.updatedAt);
  }

  async approveTutorRelationship(relationshipId: string, _approverUserId: string): Promise<TutorRelationship | null> {
    const relationship = await this.prisma.tutorRelationship.findUnique({ where: { id: relationshipId } });
    if (!relationship) return null;
    // Opcional: validar que el approverUserId sea el tutor
    const updated = await this.prisma.tutorRelationship.update({
      where: { id: relationshipId },
      data: { status: 'approved', isActive: true }
    });
    return new TutorRelationship(updated.id, updated.tutorUserId, updated.minorUserId, updated.relationshipType, updated.status, updated.isActive, updated.createdAt, updated.updatedAt);
  }

  async getRelationshipsByUserId(userId: string): Promise<TutorRelationship[]> {
    const results = await this.prisma.tutorRelationship.findMany({
      where: {
        OR: [
          { tutorUserId: userId },
          { minorUserId: userId }
        ]
      }
    });
    return results.map(r => new TutorRelationship(r.id, r.tutorUserId, r.minorUserId, r.relationshipType, r.status, r.isActive, r.createdAt, r.updatedAt));
  }

  async findById(relationshipId: string): Promise<TutorRelationship | null> {
    const r = await this.prisma.tutorRelationship.findUnique({ where: { id: relationshipId } });
    if (!r) return null;
    return new TutorRelationship(r.id, r.tutorUserId, r.minorUserId, r.relationshipType, r.status, r.isActive, r.createdAt, r.updatedAt);
  }
} 
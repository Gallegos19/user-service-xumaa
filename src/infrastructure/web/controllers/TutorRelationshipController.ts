import { Request, Response } from 'express';
import { TutorRelationshipService } from '../../../application/services/TutorRelationshipService';
import { injectable, inject } from 'inversify';

@injectable()
export class TutorRelationshipController {
  constructor(
    @inject('TutorRelationshipService') private readonly service: TutorRelationshipService
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { tutorUserId, minorUserId, relationshipType } = req.body;
      const relationship = await this.service.createTutorRelationship(tutorUserId, minorUserId, relationshipType);
      res.status(201).json({ success: true, data: relationship });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : String(error) });
    }
  }

  async approve(req: Request, res: Response): Promise<void> {
    try {
      const { relationshipId } = req.params;
      const { approverUserId } = req.body;
      const relationship = await this.service.approveTutorRelationship(relationshipId, approverUserId);
      if (!relationship) {
        res.status(404).json({ success: false, error: 'Relación no encontrada' });
        return;
      }
      res.status(200).json({ success: true, data: relationship });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : String(error) });
    }
  }

  async getByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const relationships = await this.service.getRelationshipsByUserId(userId);
      res.status(200).json({ success: true, data: relationships });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : String(error) });
    }
  }
} 
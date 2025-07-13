import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { UserRestrictionsQueryService } from '../../../application/services/UserRestrictionsQueryService';

@injectable()
export class UserRestrictionsController {
  constructor(
    @inject('UserRestrictionsQueryService') private readonly service: UserRestrictionsQueryService
  ) {}

  async getRestrictions(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const restrictions = await this.service.getRestrictionsByUserId(userId);
      if (!restrictions) {
        res.status(404).json({ success: false, error: 'Restricciones no encontradas' });
        return;
      }
      res.status(200).json({ success: true, data: restrictions });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : String(error) });
    }
  }
} 
export class TutorRelationship {
  constructor(
    public readonly id: string,
    public readonly tutorUserId: string,
    public readonly minorUserId: string,
    public relationshipType: string,
    public status: string,
    public isActive: boolean,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
} 
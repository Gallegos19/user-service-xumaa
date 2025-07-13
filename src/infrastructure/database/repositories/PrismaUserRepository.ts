import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { Email } from '../../../domain/value-objects/Email';
import { UserId } from '../../../domain/value-objects/UserId';
import { Password } from '../../../domain/value-objects/Password';
import { Age } from '../../../domain/value-objects/Age';
import { injectable, inject } from 'inversify';

@injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(
    @inject('PrismaClient') private readonly prisma: PrismaClient
  ) {}

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.getId().value },
      update: {
        email: user.getEmail().value,
        firstName: user.getFirstName(),
        lastName: user.getLastName(),
        age: user.getAge().value,
        avatarUrl: user.getAvatarUrl(),
        isVerified: user.getIsVerified(),
        accountStatus: user.getAccountStatus(),
        updatedAt: new Date()
      },
      create: {
        id: user.getId().value,
        email: user.getEmail().value,
        passwordHash: user.getHashedPassword(),
        firstName: user.getFirstName(),
        lastName: user.getLastName(),
        age: user.getAge().value,
        role: user.getRole(),
        isVerified: user.getIsVerified(),
        accountStatus: user.getAccountStatus()
      }
    });
  }

  async findById(userId: UserId): Promise<User | null> {
    const userRecord = await this.prisma.user.findUnique({
      where: { id: userId.value }
    });
    if (!userRecord) return null;
    return this.toDomain(userRecord);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const userRecord = await this.prisma.user.findUnique({
      where: { email: email.value }
    });
    if (!userRecord) return null;
    return this.toDomain(userRecord);
  }

  async findByEmailAndStatus(email: Email, status: string): Promise<User | null> {
    const userRecord = await this.prisma.user.findFirst({
      where: {
        email: email.value,
        accountStatus: status
      }
    });
    if (!userRecord) return null;
    return this.toDomain(userRecord);
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.value }
    });
    return count > 0;
  }

  async updateLastLogin(userId: UserId): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId.value },
      data: {
        lastLoginAt: new Date(),
        loginCount: { increment: 1 }
      }
    });
  }

  async countUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  async findActiveUsers(limit?: number, offset?: number): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { accountStatus: 'active' },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' }
    });
    return users.map((user: any) => this.toDomain(user));
  }

  private toDomain(record: any): User {
    // Si el registro no tiene password_hash, usamos un valor por defecto
    // ya que la entidad User requiere una contraseña en su constructor
    const password = record.password_hash 
      ? new Password(record.password_hash)
      : new Password('temporary_password'); // Contraseña temporal que no se usará
      
    const user = new User(
      new UserId(record.id),
      new Email(record.email),
      password,
      new Age(record.age),
      record.first_name,
      record.last_name,
      record.is_verified,
      record.account_status,
      record.created_at
    );
    
    // Si no había contraseña, la limpiamos para que no se use
    if (!record.password_hash) {
      (user as any).password = undefined;
    }
    
    return user;
  }
} 
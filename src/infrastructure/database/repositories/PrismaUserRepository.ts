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
        updatedAt: new Date(),
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

  async getAllUsers(options: { page: number; limit: number }): Promise<{ users: any[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: (options.page - 1) * options.limit,
        take: options.limit,
        where: { deletedAt: null },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          age: true,
          email: true,
          accountStatus: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true
        }
      }),
      this.prisma.user.count({ where: { deletedAt: null } })
    ]);

    return {
      users: users.map(user => ({
        id: user.id,
        Nombres: user.firstName,
        Apellidos: user.lastName,
        Edad: user.age,
        correo: user.email,
        Status: user.accountStatus
      })),
      pagination: {
        total,
        page: options.page,
        limit: options.limit,
        totalPages: Math.ceil(total / options.limit)
      }
    };
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User | null> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: userData.getFirstName && typeof userData.getFirstName === 'function' ? String(userData.getFirstName()) : undefined,
        lastName: userData.getLastName && typeof userData.getLastName === 'function' ? String(userData.getLastName()) : undefined,
        avatarUrl: userData.getAvatarUrl && typeof userData.getAvatarUrl === 'function' ? String(userData.getAvatarUrl()) : undefined,
        isVerified: userData.getIsVerified && typeof userData.getIsVerified === 'function' ? Boolean(userData.getIsVerified()) : undefined,
        accountStatus: userData.getAccountStatus && typeof userData.getAccountStatus === 'function' ? String(userData.getAccountStatus()) : undefined
      }
    });

    return updatedUser ? this.toDomain(updatedUser) : null;
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      // First check if user exists and is not deleted
      const user = await this.prisma.user.findFirst({
        where: { 
          id: userId,
          deletedAt: null
        }
      });
      if (!user) return false; // User doesn't exist or is already deleted
      

      // Perform soft delete
      await this.prisma.user.update({
        where: { id: userId },
        data: { 
          deletedAt: new Date() 
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findById(userId: UserId): Promise<User | null> {
    const userRecord = await this.prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        firstName: true,    
        lastName: true,    
        avatarUrl: true,   
        age: true,
        role: true,
        isVerified: true,
        accountStatus: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        passwordHash: true,
      },
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
    const password = record.passwordHash 
      ? new Password(record.passwordHash)
      : new Password('temporary_password');
      
    const user = new User(
      new UserId(record.id),
      new Email(record.email),
      password,
      new Age(record.age),
      record.firstName,       
      record.lastName, 
      record.role,       
      record.isVerified,      
      record.accountStatus,   
      record.avatarUrl,       
      new Date(record.createdAt)  
    );
    
    if (!record.passwordHash) {
      user.setPasswordHash(new Password(''));
    }
    return user;
  }
}
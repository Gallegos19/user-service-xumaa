import { Email } from '../value-objects/Email';
import { Password } from '../value-objects/Password';
import { UserId } from '../value-objects/UserId';
import { Age } from '../value-objects/Age';

export type UserRole = 'user' | 'user_minor' | 'administrador' | 'moderador';
export type AccountStatus = 'active' | 'suspended' | 'pending_verification' | 'deactivated';

export class User {
  private readonly id: UserId;
  
  private readonly email: Email;
  
  private hashedPassword: Password;
  
  private readonly age: Age;
  
  private firstName?: string;
  
  private lastName?: string;
  
  private role?: string;
  
  private isVerified: boolean = false;
  
  private accountStatus: AccountStatus = 'pending_verification';
  
  private avatarUrl?: string;
  
  private readonly createdAt: Date = new Date();

  constructor(
    id: UserId,
    email: Email,
    hashedPassword: Password,
    age: Age,
    firstName?: string,
    lastName?: string,
    role?: string,
    isVerified: boolean = false,
    accountStatus: AccountStatus = 'pending_verification',
    avatarUrl?: string,
    createdAt: Date = new Date()
  ) {
    this.id = id;
    this.email = email;
    this.hashedPassword = hashedPassword;
    this.age = age;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.isVerified = isVerified;
    this.accountStatus = accountStatus;
    this.avatarUrl = avatarUrl;
    this.createdAt = createdAt;
  }

  public static create(
    email: Email,
    password: Password,
    age: Age,
    firstName?: string,
    lastName?: string
  ): User {
    const userId = UserId.generate();
    return new User(userId, email, password, age, firstName, lastName);
  }

  public verifyEmail(): void {
    this.isVerified = true;
    this.accountStatus = 'active';
  }

  public activate(): void {
    if (!this.isVerified) {
      throw new Error('User must be verified before activation');
    }
    this.accountStatus = 'active';
  }

  public suspend(): void {
    this.accountStatus = 'suspended';
  }

  public getRole(): string | undefined{
    return this.role;
  }

  public getAvatarUrl(): string | undefined {
    return this.avatarUrl;
  }

  public updateAvatarUrl(avatarUrl: string): void {
    this.avatarUrl = avatarUrl;
  }

  public needsParentalConsent(): boolean {
    return this.age.requiresParentalConsent();
  }

  public canLogin(): boolean {
    return this.isVerified && this.accountStatus === 'active';
  }

  public getHashedPassword(): string { 
    return this.hashedPassword.value; 
  }

  public updatePassword(newPassword: Password): void {
    this.hashedPassword = newPassword;
  }

  // Getters
  public getId(): UserId { return this.id; }
  public getEmail(): Email { return this.email; }
  public getAge(): Age { return this.age; }
  public getFirstName(): string | undefined { return this.firstName; }
  public getLastName(): string | undefined { return this.lastName; }
  public getIsVerified(): boolean { return this.isVerified; }
  public getAccountStatus(): AccountStatus { return this.accountStatus; }
  public getCreatedAt(): Date { return this.createdAt; }
  public getPasswordHash(): Password { return this.hashedPassword; }
  public setPasswordHash(password: Password): void {
    this.hashedPassword = password;
  }
}
// import { Injectable } from '@nestjs/common';
// import { User } from '../../domain/entities/User';
// import { UserQueryPort } from '../ports/input/UserQueryPort';
// import { UserCommandPort } from '../ports/input/UserCommandPort';

// @Injectable()
// export class UserService implements UserQueryPort, UserCommandPort {
//   constructor(
//     // Here you would inject your repositories or other dependencies
//   ) {}

//   async findAll(): Promise<User[]> {
//     // Implementation for finding all users
//     // Example: return this.userRepository.findAll();
//     return [];
//   }

//   async findById(id: string): Promise<User | null> {
//     // Implementation for finding a user by ID
//     // Example: return this.userRepository.findById(id);
//     return null;
//   }

//   async create(user: Partial<User>): Promise<User> {
//     // Implementation for creating a new user
//     // Example: return this.userRepository.create(user);
//     return user as User;
//   }

//   async update(id: string, user: Partial<User>): Promise<User | null> {
//     // Implementation for updating a user
//     // Example: return this.userRepository.update(id, user);
//     return null;
//   }

//   async delete(id: string): Promise<boolean> {
//     // Implementation for deleting a user
//     // Example: return this.userRepository.delete(id);
//     return false;
//   }
// }

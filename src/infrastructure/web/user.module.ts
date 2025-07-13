import { Module } from '@nestjs/common';
import { UserService } from '../../application/services/user.service';
import { PrismaUserRepository } from '../database/repositories/PrismaUserRepository';
import { UserController } from './controllers/UserController';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}

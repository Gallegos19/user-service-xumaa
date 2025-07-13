import { Module } from '@nestjs/common';
import { PrismaUserRepository } from '../database/repositories/PrismaUserRepository';
import { UserController } from './controllers/UserController';
import { UserQueryService } from '@/application/services/UserQueryService';

@Module({
  controllers: [UserController],
  providers: [
    UserQueryService,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserQueryService],
})
export class UserModule {}

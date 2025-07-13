import { Container } from 'inversify';
import 'reflect-metadata';

// Controllers
import { UserController } from '../web/controllers/UserController';
import { TutorRelationshipController } from '../web/controllers/TutorRelationshipController';
import { UserRestrictionsController } from '../web/controllers/UserRestrictionsController';

// Services
import { TutorRelationshipService } from '../../application/services/TutorRelationshipService';
import { UserRestrictionsQueryService } from '../../application/services/UserRestrictionsQueryService';
import { UserPreferencesCommandService } from '../../application/services/UserPreferencesCommandService';
import { UserCommandService } from '../../application/services/UserCommandService';
import { UserQueryService } from '../../application/services/UserQueryService';
import { UserAvatarCommandService } from '../../application/services/UserAvatarCommandService';
import { UserPreferencesQueryService } from '../../application/services/UserPreferencesQueryService';

// Repositories
import { PrismaTutorRelationshipRepository } from '../database/repositories/PrismaTutorRelationshipRepository';
import { PrismaUserRestrictionsRepository } from '../database/repositories/PrismaUserRestrictionsRepository';
import { PrismaUserPreferencesRepository } from '../database/repositories/PrismaUserPreferencesRepository';
import { PrismaUserRepository } from '../database/repositories/PrismaUserRepository';

// Ports

// Database
import { Database } from './database';
import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { ITutorRelationshipRepository } from '@/domain/repositories/ITutorRelationshipRepository';
import { IUserRestrictionsRepository } from '@/domain/repositories/IUserRestrictionsRepository';
import { IUserPreferencesRepository } from '@/domain/repositories/IUserPreferencesRepository';
import { UserCommandPort } from '@/application/ports/input/UserCommandPort';
import { UserQueryPort } from '@/application/ports/input/UserQueryPort';
import { UserAvatarCommandPort } from '@/application/ports/input/UserAvatarCommandPort';
import { UserPreferencesQueryPort } from '@/application/ports/input/UserPreferencesQueryPort';
import { UserPreferencesCommandPort } from '@/application/ports/input/UserPreferencesCommandPort';

const container = new Container();

// Database
container.bind<PrismaClient>('PrismaClient').toDynamicValue(() => {
  return new PrismaClient();
}).inSingletonScope();

container.bind(Database).toSelf().inSingletonScope();

// Repositories
container.bind<IUserRepository>('IUserRepository').to(PrismaUserRepository).inSingletonScope();
container.bind<ITutorRelationshipRepository>('ITutorRelationshipRepository').to(PrismaTutorRelationshipRepository).inSingletonScope();
container.bind<IUserRestrictionsRepository>('IUserRestrictionsRepository').to(PrismaUserRestrictionsRepository).inSingletonScope();
container.bind<IUserPreferencesRepository>('IUserPreferencesRepository').to(PrismaUserPreferencesRepository).inSingletonScope();

// Services
container.bind<UserCommandPort>('UserCommandPort').to(UserCommandService);
container.bind<UserQueryPort>('UserQueryPort').to(UserQueryService);
container.bind<UserAvatarCommandPort>('UserAvatarCommandPort').to(UserAvatarCommandService);
container.bind<UserPreferencesQueryPort>('UserPreferencesQueryPort').to(UserPreferencesQueryService);
container.bind<UserPreferencesCommandPort>('UserPreferencesCommandPort').to(UserPreferencesCommandService);
container.bind<TutorRelationshipService>('TutorRelationshipService').to(TutorRelationshipService);
container.bind<UserRestrictionsQueryService>('UserRestrictionsQueryService').to(UserRestrictionsQueryService);

// Controllers
container.bind(UserController).toSelf();
container.bind(TutorRelationshipController).toSelf();
container.bind(UserRestrictionsController).toSelf();

export { container };
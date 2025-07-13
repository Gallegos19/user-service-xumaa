import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

let app: INestApplication;
let prisma: PrismaClient;

beforeAll(async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
  
  prisma = app.get(PrismaClient);
  
  // Clean database before tests
  await prisma.cleanDatabase();
});

afterAll(async () => {
  await app.close();
});

export { app, prisma };

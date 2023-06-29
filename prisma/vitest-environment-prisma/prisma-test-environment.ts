import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import { Environment } from 'vitest';
import { PrismaClient } from '@prisma/client';

// npm link -> dentro da pasta vitest-environment-prisma
// npm link vitest-environment-prisma -> na raiz do projeto

//postgresql://docker:docker@localhost:5432/apisolid?schema=public

const prisma = new PrismaClient();

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schema);

  return url.toString();
}

export default <Environment>{
  name: 'prisma',
  async setup() {
    // Schema do postgres são ambientes do banco de dados
    // O shema public é o padrão, mas podemos criar um schema para teste
    const schema = randomUUID();
    const databaseURL = generateDatabaseURL(schema);

    process.env.DATABASE_URL = databaseURL;

    //execSyn roda comandos como se estivessem no terminal
    //migrate deploy não faz a comparação entre migrations
    execSync('npx prisma migrate deploy');

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
        );
        await prisma.$disconnect();
      },
    };
  },
};

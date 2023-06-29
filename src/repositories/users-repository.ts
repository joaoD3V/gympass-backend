import { Prisma, User } from '@prisma/client';

// Sempre que for fazer uma alteração nos repositories, começar por aqui (contrato)

export interface UsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
}

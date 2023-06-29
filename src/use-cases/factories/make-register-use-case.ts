import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { RegisterUseCase } from '../register';

// Factory Pattern
// Serve para centralizar a criação (instanciação) do caso de uso
// Fábricas -> funções que criam entidades maiores como dependências
// A intenção é não possuir regras de negócio

export function makeRegisterUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const registerUseCase = new RegisterUseCase(prismaUsersRepository);

  return registerUseCase;
}

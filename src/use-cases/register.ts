import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { User } from '@prisma/client';

// Novas funcionalidades sempre começar pelo caso de uso
// Ou seja, sempre começar de baixo pra cima dentro de uma aplicação
// O caso de uso descreve em baixo nível uma funcionalidade

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

// Caso de uso serve para abstrair alguma lógica independente da entrada e saída

// SOLID

// D - Dependency Inversion Principle
// -> Inverte a ordem que a dependência chega no caso de uso
// -> Ao invés do caso de uso instanciar a dependência que ele precisa, ele recebe as dependências como parâmetro
// -> Cada classe de caso de uso terá sempre um único método

export class RegisterUseCase {
  // private usersRepository: any;

  // constructor(usersRepository: any) {
  //   this.usersRepository = usersRepository;
  // }

  // Um atributo de visibilidade já instancia automaticamente
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    // const prismaUsersRepository = new PrismaUsersRepository();

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return { user };
  }
}

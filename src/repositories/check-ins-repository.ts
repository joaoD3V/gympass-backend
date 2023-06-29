import { CheckIn, Prisma } from '@prisma/client';

export interface CheckInsRepository {
  //UncheckedCreateInput usado para criar também um registro em outras tabelas ao mesmo tempo
  //Sendo assim é possível obter o id das outras tabelas
  //O relacionamento entre tabelas já existe anteriormente na hora da criação
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  save(checkIn: CheckIn): Promise<CheckIn>;
  //finBy usado para representar o retorno um único registro
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
  //findManyBy usado para representar o retorno de múltiplos registros
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>;
  findById(id: string): Promise<CheckIn | null>;
  countByUserId(userId: string): Promise<number>;
}

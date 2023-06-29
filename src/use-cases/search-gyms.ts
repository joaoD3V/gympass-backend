import { GymsRepository } from '@/repositories/gyms-repository';
import { Gym } from '@prisma/client';

interface SearchGymsUseCaseRequest {
  query: string; // Melhor usar o campo query do que um campo direto pra busca
  page: number;
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[];
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return { gyms };
  }
}

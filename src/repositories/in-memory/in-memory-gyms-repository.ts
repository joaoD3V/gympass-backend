import { Prisma, Gym } from '@prisma/client';
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';
import { randomUUID } from 'node:crypto';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

//Patern InMemoryDatabase

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }

  async findManyNearby(params: FindManyNearbyParams) {
    const MAX_DISTANCE_NEARBY_IN_KILOMETERS = 10;

    return this.items.filter((items) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: items.latitude.toNumber(),
          longitude: items.longitude.toNumber(),
        }
      );

      return distance < MAX_DISTANCE_NEARBY_IN_KILOMETERS;
    });
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    };

    this.items.push(gym);

    return gym;
  }
}

import { MaxDistanceError } from '@/use-cases/errors/max-distance-error';
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create(req: FastifyRequest, rep: FastifyReply) {
  try {
    const createCheckInParamsSchema = z.object({
      gymId: z.string().uuid(),
    });

    const createCheckInBodySchema = z.object({
      latitude: z.coerce.number().refine((value) => {
        return Math.abs(value) <= 90;
      }),
      longitude: z.coerce.number().refine((value) => {
        return Math.abs(value) <= 180;
      }),
    });

    const { gymId } = createCheckInParamsSchema.parse(req.params);
    const { latitude, longitude } = createCheckInBodySchema.parse(req.body);

    const checkInUseCase = makeCheckInUseCase();
    await checkInUseCase.execute({
      gymId,
      userId: req.user.sub,
      userLatitude: latitude,
      userLongitude: longitude,
    });

    return rep.status(201).send();
  } catch (err) {
    if (
      err instanceof ResourceNotFoundError ||
      err instanceof MaxDistanceError ||
      err instanceof MaxNumberOfCheckInsError
    ) {
      return rep.status(400).send({
        message: err.message,
      });
    }

    throw err;
  }
}

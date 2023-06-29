import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function history(req: FastifyRequest, rep: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(req.query);

  const fetchUserCheckInHistoryUseCase = makeFetchUserCheckInsHistoryUseCase();
  const { checkIns } = await fetchUserCheckInHistoryUseCase.execute({
    userId: req.user.sub,
    page,
  });

  return rep.status(200).send({
    checkIns,
  });
}

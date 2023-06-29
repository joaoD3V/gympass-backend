import { LateCheckInValidationError } from '@/use-cases/errors/late-check-in-validation-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function validate(req: FastifyRequest, rep: FastifyReply) {
  try {
    const validateCheckInParamsSchema = z.object({
      checkInId: z.string().uuid(),
    });

    const { checkInId } = validateCheckInParamsSchema.parse(req.params);

    const validateCheckInUseCase = makeValidateCheckInUseCase();
    await validateCheckInUseCase.execute({
      checkInId,
    });

    return rep.status(204).send();
  } catch (err) {
    if (
      err instanceof ResourceNotFoundError ||
      err instanceof LateCheckInValidationError
    ) {
      return rep.status(400).send({
        message: err.message,
      });
    }

    throw err;
  }
}

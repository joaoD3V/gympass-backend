import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function register(req: FastifyRequest, rep: FastifyReply) {
  const registebodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registebodySchema.parse(req.body);

  try {
    const registerUseCase = makeRegisterUseCase();
    await registerUseCase.execute({ name, email, password });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return rep.status(409).send({
        message: err.message,
      });
    }

    throw err;
  }

  return rep.status(201).send();
}

import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function authenticate(req: FastifyRequest, rep: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(req.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({ email, password });

    // Jamais coloque dados sensiveis ou sigilosos do usuário dentro do JWT
    // O primeiro objeto é o payload
    const token = await rep.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      }
    );

    // O usuário só vai perder a autenticação se ele ficar x dias sem entrar na aplicação
    const refreshToken = await rep.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d', // 7 dias
        },
      }
    );

    return rep
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true, // Encriptado através do HTTPS -> O Front não conseguirá pegar a informação bruta
        sameSite: true, // Só vai ser acessível dentro do mesmo domínio/site
        httpOnly: true, // O cookie só será acessado pelo backend, não ficará salvo no front da aplicação
      })
      .status(200)
      .send({
        token,
      });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return rep.status(400).send({
        message: err.message,
      });
    }

    throw err;
  }
}

import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { ZodError } from 'zod';
import { env } from './env';
import { usersRoutes } from './http/controllers/users/routes';
import { gymsRoutes } from './http/controllers/gyms/routes';
import { checkInsRoutes } from './http/controllers/check-ins/routes';

export const app = fastify();

/*
==== Para a integração do Front com o back ====
app.register(fastifyCors, {
  origin: true,
  credentials: true,
});

==== No AXIOS ====
const api = axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials: true,
})
*/

app.register(fastifyCookie);

// Estratégia do Refresh Token
// Caso queira deixar o usuário logado pra sempre na nossa aplicação, é interessante deixar um tempo curto de expiração
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false, // Não possui assinatura via hash pelo backend
  },
  sign: {
    expiresIn: '10m', //10 minutos
  },
});

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((err, _, rep) => {
  if (err instanceof ZodError) {
    return rep
      .status(400)
      .send({ message: 'Validation error.', issues: err.format() });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(err);
  } else {
    // TODO Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return rep.status(500).send({ message: 'Internal server error.' });
});

import { FastifyInstance } from 'fastify';
import { register } from './register';
import { authenticate } from './authenticate';
import { profile } from './profile';
import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { refresh } from './refresh';

export async function usersRoutes(app: FastifyInstance) {
  //Pensar nas rotas como se fossem entidades

  app.post('/users', register);
  app.post('/sessions', authenticate);

  app.patch('/token/refresh', refresh);

  /** Authenticated */
  // Basic Auth -> Envio de credenciais pelo Header Authorization Basic em base64 (não seguro mesmo com HTTPS)

  // JWT (JSON Web Token)
  // Usuário faz login, envia e-mail/senha, o back-end cria um token ÚNICO e não-modificável e STATELESS
  // Stateless: Não armazenado em nenhum estrutura de persistência de dados (banco de dados)
  // Back-end: Quando vai criar um token ele usa uma PALAVRA-CHAVE (string)
  // Palavra-chave: lkadfjasdifhwioueyrjkbsdfiweuyrsbdfw9e823sjhdfgw9e854
  // E-mail/senha -> header.payload.sign
  // sub -> id do usuário
  // Login => JWT
  //JWT => Todas requisições dali pra frente
  //Header (cabeçalho): Authorization: Bearer JWT

  // A parte de JWT fica apenas na camada externa (controllers) e não nos casos de uso

  app.get('/me', { onRequest: verifyJWT }, profile);
}

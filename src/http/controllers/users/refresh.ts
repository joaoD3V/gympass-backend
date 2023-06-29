import { FastifyReply, FastifyRequest } from 'fastify';

export async function refresh(req: FastifyRequest, rep: FastifyReply) {
  // Vai validar se o usuário está autenticado, não vai verificar o Header da requisição, somente os cookies se existe o refreshToken
  await req.jwtVerify({ onlyCookie: true });
  // Se proseeguir a partir daqui, quer dizer que o refreshToken é válido e que ainda não expirou

  const { role } = req.user;

  const token = await rep.jwtSign(
    { role },
    {
      sign: {
        sub: req.user.sub,
      },
    }
  );

  // Essa estratégia implementada não salva o token nos bancos de dados, com isso não é possível invalidar um refresh token

  const refreshToken = await rep.jwtSign(
    { role },
    {
      sign: {
        sub: req.user.sub,
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
}

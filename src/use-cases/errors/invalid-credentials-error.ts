// Evitar de informar o tipo de erro por questões de segurança
// Por exemplo: Usuário não encontrado / Senha inválida

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid Credentials.');
  }
}

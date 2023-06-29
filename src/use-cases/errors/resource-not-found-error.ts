// Criação de erro genérico

export class ResourceNotFoundError extends Error {
  constructor() {
    super('Resource not found.');
  }
}

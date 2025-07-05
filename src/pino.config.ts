import type { Params } from 'nestjs-pino';

export default async function getPinoConfig(): Promise<Params> {
  switch (process.env.NODE_ENV) {
    case 'production':
      return (await import('./pino.config.prod')).default;
    default:
      return (await import('./pino.config.local')).default;
  }
}

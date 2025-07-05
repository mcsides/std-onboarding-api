import { Params } from 'nestjs-pino';

const config: Params = {
  pinoHttp: {
    serializers: { req: () => undefined },
    customProps: (req) => ({
      http: {
        method: req.method,
        url: req.url,
        id: req.id,
      },
    }),
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        singleLine: true,
      },
    },
  },
};

export default config;

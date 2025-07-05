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
    level: 'info',
  },
};

export default config;

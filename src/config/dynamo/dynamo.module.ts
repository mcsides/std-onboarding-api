// dynamo.module.ts
import { Module, DynamicModule, Provider } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoModuleOptions, DYNAMO_CLIENT } from './dynamo.config';

@Module({})
export class DynamoModule {
  static forRoot(options: DynamoModuleOptions): DynamicModule {
    const dynamoProvider: Provider = {
      provide: DYNAMO_CLIENT,
      useFactory: () => {
        const clientConfig: DynamoModuleOptions = {
          region: options.region,
        };

        if (options.endpoint) {
          clientConfig.endpoint = options.endpoint;
          clientConfig.accessKeyId = options.accessKeyId;
          clientConfig.secretAccessKey = options.secretAccessKey;
        }

        const ddbClient = new DynamoDBClient(clientConfig);
        return DynamoDBDocumentClient.from(ddbClient);
      },
    };

    return {
      module: DynamoModule,
      providers: [dynamoProvider],
      exports: [dynamoProvider],
    };
  }
}

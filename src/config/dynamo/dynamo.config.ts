export interface DynamoModuleOptions {
  region: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

export const DYNAMO_CLIENT = Symbol('DYNAMO_CLIENT');

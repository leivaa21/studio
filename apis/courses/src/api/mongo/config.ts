import 'dotenv/config';
import { ConnectOptions } from 'mongoose';
import { env } from '../config/env';

export const uri = `mongodb://${env.mongo.host}:${env.mongo.port}`;
export const options: ConnectOptions = {
  user: env.mongo.user,
  pass: env.mongo.pass,
  dbName: env.mongo.db,
  ignoreUndefined: true,
};

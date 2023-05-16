import 'dotenv/config';
import { ConnectOptions } from 'mongoose';

const { MONGO_HOST, MONGO_PORT, MONGO_DATABASE, MONGO_USER, MONGO_PASS } =
  process.env;

export const config = {
  host: MONGO_HOST || 'localhost',
  port: MONGO_PORT || 27017,
  db: MONGO_DATABASE,
  user: MONGO_USER,
  pass: MONGO_PASS,
};

export const uri = `mongodb://${config.host}:${config.port}`;
export const options: ConnectOptions = {
  user: config.user,
  pass: config.pass,
  dbName: config.db,
  ignoreUndefined: true,
};

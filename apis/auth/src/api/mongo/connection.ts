import { info } from '@studio/api-utils/loggers/console';
import mongoose, { ConnectOptions } from 'mongoose';
import config from './config';

const uri = `mongodb://${config.host}`;
const options: ConnectOptions = {
  user: config.user,
  pass: config.pass,
  dbName: config.db,
  ignoreUndefined: true,
};

export const configMongoose = () => {
  mongoose.set('strictQuery', false);
};

export const connectToMongo = () => {
  mongoose
    .connect(uri, options)
    .then(() => info('Conection to mongo stablished succesfully'));
};

import { info } from '@studio/api-utils';
import mongoose, { ConnectOptions } from 'mongoose';

export const configMongoose = () => {
  mongoose.set('strictQuery', false);
};

export const connectToMongo = async ({
  uri,
  options,
}: {
  uri: string;
  options?: ConnectOptions;
}) => {
  return mongoose
    .connect(uri, options)
    .then(() => info(`Conection to mongo at ${uri} stablished succesfully`));
};

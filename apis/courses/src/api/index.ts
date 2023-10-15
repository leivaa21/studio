import './di';

import { info } from '@studio/api-utils';

import { app } from './app';
import { env } from './config/env';
import { configMongoose, connectToMongo } from './mongo/connection';
import { options, uri } from './mongo/config';

const { NODE_ENV } = process.env;

configMongoose();
connectToMongo({ uri, options });

app.listen(env.courses.port, () => {
  info(
    `Hey, running on ${env.courses.url}:${env.courses.port} on env: ${NODE_ENV}`
  );
});

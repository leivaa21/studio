import { info } from '@studio/api-utils';

import { app } from './app';
import { configMongoose, connectToMongo } from './mongo/connection';
import { options, uri } from './mongo/config';
import { env } from './config/env';

configMongoose();
connectToMongo({ uri, options });

const { NODE_ENV } = process.env;

app.listen(env.auth.port, () => {
  info(`Hey, running on http://localhost:${env.auth.port} on env: ${NODE_ENV}`);
});

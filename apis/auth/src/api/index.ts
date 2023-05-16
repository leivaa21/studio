import { info } from '@studio/api-utils';

import { app } from './app';
import { configMongoose, connectToMongo } from './mongo/connection';
import { options, uri } from './mongo/config';

configMongoose();
connectToMongo({ uri, options });

const port = 5000;

const { NODE_ENV } = process.env;

app.listen(port, () => {
  info(`Hey, running on http://localhost:${port} on env: ${NODE_ENV}`);
});

import { info } from '@studio/api-utils';

import { app } from './app';
import { env } from './config/env';

const { NODE_ENV } = process.env;

app.listen(env.courses.port, () => {
  info(
    `Hey, running on ${env.courses.url}:${env.courses.port} on env: ${NODE_ENV}`
  );
});

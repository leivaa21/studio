import 'dotenv/config';

function getEnvVariableOrThrow(varName: string): string {
  const variable = process.env[varName];

  if (!variable) {
    throw new Error(`<${varName}> Should be defined in .env file`);
  }

  return variable;
}

function getEnvVariableOrDefault<T>(varName: string, defaultValue: T): T {
  const variable = process.env[varName] as T;

  return variable || defaultValue;
}

export const env = {
  auth: {
    port: getEnvVariableOrThrow('PORT'),
    url: getEnvVariableOrThrow('URL'),
  },
  web: {
    url: getEnvVariableOrThrow('WEB_URL'),
    api_url: `${getEnvVariableOrThrow('WEB_URL')}/api`,
  },
  courses: {
    url: getEnvVariableOrThrow('COURSES_URL'),
  },
  rabbit: {
    host: getEnvVariableOrDefault<string>('RABBIT_HOST', 'localhost'),
    port: getEnvVariableOrDefault<number>('RABBIT_PORT', 5672),
    auth_queue: getEnvVariableOrDefault<string>(
      'RABBIT_AUTH_QUEUE',
      'auth-queue'
    ),
    courses_queue: getEnvVariableOrDefault<string>(
      'RABBIT_COURSES_QUEUE',
      'courses-queue'
    ),
  },
  internal: {
    secret: getEnvVariableOrThrow('INTERNAL_SECRET'),
    password: getEnvVariableOrThrow('INTERNAL_PASSWORD'),
  },
  jwt: {
    secret: getEnvVariableOrThrow('JWT_SECRET'),
  },
  google: {
    id: getEnvVariableOrThrow('GOOGLE_OAUTH_ID'),
    secret: getEnvVariableOrThrow('GOOGLE_OAUTH_SECRET'),
  },
  github: {
    id: getEnvVariableOrThrow('GITHUB_OAUTH_ID'),
    secret: getEnvVariableOrThrow('GITHUB_OAUTH_SECRET'),
  },
};

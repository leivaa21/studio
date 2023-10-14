import 'dotenv/config';

function getEnvVariableOrDefault<T>(varName: string, defaultValue: T): T {
  const variable = process.env[varName] as T;

  return variable || defaultValue;
}

function getEnvVariableOrUndefined<T>(varName: string): T | undefined {
  return getEnvVariableOrDefault<T | undefined>(varName, undefined);
}

export const env = {
  courses: {
    port: getEnvVariableOrDefault<number>('PORT', 5002),
    url: getEnvVariableOrDefault<string>('URL', 'http://localhost'),
  },
  mongo: {
    host: getEnvVariableOrDefault<string>('MONGO_HOST', 'localhost'),
    port: getEnvVariableOrDefault<number>('MONGO_PORT', 27017),
    db: getEnvVariableOrDefault<string>('MONGO_DATABASE', 'studio-courses'),
    user: getEnvVariableOrUndefined<string>('MONGO_USER'),
    pass: getEnvVariableOrUndefined<string>('MONGO_PASS'),
  },
  rabbit: {
    host: getEnvVariableOrDefault<string>('RABBIT_HOST', 'localhost'),
    port: getEnvVariableOrDefault<number>('RABBIT_PORT', 5672),
    event_queue: getEnvVariableOrDefault<string>(
      'RABBIT_EVENT_QUEUE',
      'event-bus'
    ),
  },
  jwt: {
    secret: getEnvVariableOrDefault<string>('JWT_SECRET', 'jwt-secret'),
  },
  internal: {
    secret: getEnvVariableOrDefault<string>(
      'INTERNAL_SECRET',
      'internal-secret'
    ),
    password: getEnvVariableOrDefault<string>(
      'INTERNAL_PASSWORD',
      'internal-password'
    ),
  },
};

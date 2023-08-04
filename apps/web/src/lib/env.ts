import 'dotenv/config';
import { EnviromentVariableNotFoundError } from '../contexts/shared/domain/errors/EnviromentVariableNotFoundError';

function getEnviromentVariableOrThrow(variableName: string): string {
  const variable = process.env[variableName];

  if (!variable) {
    throw EnviromentVariableNotFoundError.causeIsUndefined(variableName);
  }

  return variable;
}

export const env = {
  app: {
    url: getEnviromentVariableOrThrow('appUrl'),
    isDevelopment: getEnviromentVariableOrThrow('NODE_ENV') === 'development',
  },
  auth: {
    url: getEnviromentVariableOrThrow('authUrl'),
  },
  courses: {
    url: getEnviromentVariableOrThrow('coursesUrl'),
  },
  jwt: {
    secret: getEnviromentVariableOrThrow('jwtSecret'),
  },
};

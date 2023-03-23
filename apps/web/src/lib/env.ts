import 'dotenv/config';
import { EnviromentVariableNotFoundError } from '../contexts/shared/domain/errors/EnviromentVariableNotFoundError';

function getEnviromentVariableOrThrow(variableName: string): string {
  const variable = process.env[variableName];

  if(!variable) {
    throw EnviromentVariableNotFoundError.causeIsUndefined(variableName);
  }

  return variable
}

export const env = {
  auth: {
    url: getEnviromentVariableOrThrow('authUrl')
  },
  jwt: {
    secret: getEnviromentVariableOrThrow('jwtSecret')
  }
}
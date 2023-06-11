import 'dotenv/config';

function getEnvVariableOrThrow(varName: string): string {
  const variable = process.env[varName];

  if (!variable) {
    throw new Error(`<${varName}> Should be defined in .env file`);
  }

  return variable;
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

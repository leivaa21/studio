import 'dotenv/config';

function getEnvVariableOrThrow(varName: string): string {
  const variable = process.env[varName];

  if (!variable) {
    throw new Error(`<${varName}> Should be defined in .env file`);
  }

  return variable;
}

export const env = {
  courses: {
    port: getEnvVariableOrThrow('PORT'),
    url: getEnvVariableOrThrow('URL'),
  },
};

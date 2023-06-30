import 'dotenv/config';

function getEnvVariableOrDefault<T>(varName: string, defaultValue: T): T {
  const variable = process.env[varName] as T;

  return variable || defaultValue;
}

export const env = {
  courses: {
    port: getEnvVariableOrDefault<number>('PORT', 5002),
    url: getEnvVariableOrDefault<string>('URL', 'http://localhost'),
  },
};

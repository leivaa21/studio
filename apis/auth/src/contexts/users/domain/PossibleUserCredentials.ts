import {
  UserBasicCredentialAsPrimitives,
  UserBasicCredentials,
} from './UserBasicCredentials';
import {
  UserGithubCredentials,
  UserGithubCredentialsAsPrimitives,
} from './UserGithubCredentials';
import {
  UserGoogleCredentials,
  UserGoogleCredentialsAsPrimitives,
} from './UserGoogleCredentials';

export type PossibleUserCredentialsType = 'BASIC' | 'GOOGLE' | 'GITHUB';
export type PossibleUserCredentials =
  | UserBasicCredentials
  | UserGoogleCredentials
  | UserGithubCredentials;

export type PossibleUserCredentialsAsPrimitives =
  | UserBasicCredentialAsPrimitives
  | UserGoogleCredentialsAsPrimitives
  | UserGithubCredentialsAsPrimitives;

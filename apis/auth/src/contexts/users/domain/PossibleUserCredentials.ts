import {
  UserBasicCredentialAsPrimitives,
  UserBasicCredentials,
} from './UserBasicCredentials';
import {
  UserGoogleCredentials,
  UserGoogleCredentialsAsPrimitives,
} from './UserGoogleCredentials';

export type PossibleUserCredentialsType = 'BASIC' | 'GOOGLE';
export type PossibleUserCredentials =
  | UserBasicCredentials
  | UserGoogleCredentials;

export type PossibleUserCredentialsAsPrimitives =
  | UserBasicCredentialAsPrimitives
  | UserGoogleCredentialsAsPrimitives;

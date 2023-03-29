export interface HttpError extends Error, Object {
  statusCode: number,
}
export default interface HttpError extends Error, Object {
    statusCode: number;
}

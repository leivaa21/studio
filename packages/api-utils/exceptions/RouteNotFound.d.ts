import HttpError from "../interfaces/httpError";
declare class RouteNotFound extends Error implements HttpError {
    readonly statusCode: number;
    constructor(method: string, path: string);
}
export default RouteNotFound;

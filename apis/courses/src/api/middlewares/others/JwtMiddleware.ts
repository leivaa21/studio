import * as express from 'express';
import jwt from 'jsonwebtoken';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { env } from '../../config/env';
import { Injectable } from '@studio/dependency-injection';
import { UnauthorizedError } from '@studio/api-utils';

@Injectable()
export class JwtMiddleware implements ExpressMiddlewareInterface {
  public use(
    req: express.Request & { jwt: unknown },
    res: express.Response,
    next: express.NextFunction
  ): void {
    if (req.headers.authorization) {
      const jwtToken = req.headers.authorization as string;
      const decodedJwtToken = jwt.verify(jwtToken, env.internal.secret);
      if (decodedJwtToken !== env.internal.password) {
        throw new UnauthorizedError(req.method, req.path);
      }

      req.jwt = decodedJwtToken;
      next();
    } else {
      throw new UnauthorizedError(req.method, req.path);
    }
  }
}

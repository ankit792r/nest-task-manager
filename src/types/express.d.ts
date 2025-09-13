import { type Request as ExRequest } from 'express';
import { UserPayload } from 'src/auth/auth.guard';

declare module 'express' {
  interface Request extends ExRequest {
    user?: UserPayload;
  }
}

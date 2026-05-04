/**
 * NOTE: This file adds the 'user' attribute to the request type
 */

import { AuthUser } from './auth-user';

declare global {
  namespace Express {
    // Disable the @typescript-eslint/consistent-type-definitions rule to make use of declaration merging
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      user?: AuthUser;
    }
  }
}

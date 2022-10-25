import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';

/**
 * Checks if the current user is an anonymous user
 */
const isInAnon = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    if (user.anon) {
        res.status(403).json({
          error: 'Already in anonymous mode'
        });
        return;
      }
    next();
};

/**
 * Checks if the current user is not an anonymous user
 */
const isNotInAnon = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    if (!user.anon) {
        res.status(403).json({
          error: 'Not in anonymous mode'
        });
        return;
      }
    next();
};
  
export {
  isInAnon,
  isNotInAnon
};
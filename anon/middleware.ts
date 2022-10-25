import type {Request, Response, NextFunction} from 'express';

import {Types} from 'mongoose';
import UserCollection from '../user/collection';

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
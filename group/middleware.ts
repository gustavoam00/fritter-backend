import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import GroupCollection from './collection';

const isGroupExists = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.params.groupId);
    const group = validFormat ? await GroupCollection.findGroup(req.params.groupId) : '';
    if (!group) {
      res.status(404).json({
        error: {
          freetNotFound: `Group with group ID ${req.params.groupId} does not exist.`
        }
      });
      return;
    }
  
    next();
};

const isValidGroupModifier = async (req: Request, res: Response, next: NextFunction) => {
    const group = await GroupCollection.findGroup(req.params.groupId);
    const userId = group.owner._id;
    if (req.session.userId !== userId.toString()) {
      res.status(403).json({
        error: 'Cannot modify other users\' groups.'
      });
      return;
    }
  
    next();
};

const isGroupNameNotAlreadyInUse = async (req: Request, res: Response, next: NextFunction) => {
    const group = await GroupCollection.findGroupByName(req.session.userId, req.body.name);
  
    if (group) {
      res.status(409).json({
      error: {
        username: 'A group with this name already exists.'
      }
    });
      return;
    }
    next();
};

const isMemberNotExist = async (req: Request, res: Response, next: NextFunction) => {
    next();
};

export {
    isGroupExists,
    isValidGroupModifier,
    isGroupNameNotAlreadyInUse,
    isMemberNotExist
};
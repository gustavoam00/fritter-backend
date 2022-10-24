import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import GroupCollection from './collection';
import UserCollection from '../user/collection';

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

const isGroupExistsName = async (req: Request, res: Response, next: NextFunction) => {
  const group =  await GroupCollection.findGroupByName(req.session.userId, req.params.groupName);
  if (!group) {
    res.status(404).json({
      error: {
        freetNotFound: `Group with group name ${req.params.groupName} does not exist.`
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

const isGroupNameNotInUse = async (req: Request, res: Response, next: NextFunction) => {
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

const isMemberNotInGroup = async (req: Request, res: Response, next: NextFunction) => {
  const group = await GroupCollection.findGroupByName(req.session.userId, req.params.groupName);
  if (!group.members.includes(req.params.memberId)){
    res.status(404).json({
      error: `User with id ${req.params.memberId as string} not in group.`
    });
    return;
  }
    next();
};


const isValidMember = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.params.memberId);
  if (!user) {
    res.status(404).json({
      error: `User with id ${req.params.memberId as string} does not exist.`
    });
    return;
  }
  const group = await GroupCollection.findGroupByName(req.session.userId, req.params.groupName);
  if (group.owner == req.session.userId){
    res.status(403).json({
      error: `Owner cannot be added to own group`
    });
    return;
  }
  if (group.members.includes(req.params.memberId)){
    res.status(403).json({
      error: `User with id ${req.params.memberId as string} already in group.`
    });
    return;
  }
  next();
};


export {
    isGroupExists,
    isGroupExistsName,
    isValidGroupModifier,
    isGroupNameNotInUse,
    isMemberNotInGroup,
    isValidMember,
};
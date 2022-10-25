import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import GroupCollection from './collection';
import UserCollection from '../user/collection';

/**
 * Checks that the group with 'groupId' exists
 */
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

/**
 * Checks that the group with 'groupName' owned by 'owner' exists
 */
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

/**
 * Checks that the user is the owner of group with 'groupId'
 */
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

/**
 * Checks that the user doesn't already have a group with 'name'
 */
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

/**
 * Checks that 'userId' not already a member of group wiht 'groupName'
 */
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

/**
 * Checks that 'memberId' is a valid member to be added to group,
 * they need to exist
 * they cannot be the owner themselves,
 * and they cannot be already be a member of the group
 */
const isValidMember = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.params.memberId);
  if (!user) {
    res.status(404).json({
      error: `User with id ${req.params.memberId as string} does not exist.`
    });
    return;
  }
  const group = await GroupCollection.findGroupByName(req.session.userId, req.params.groupName);
  if (group.owner.equals(req.params.memberId)){

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
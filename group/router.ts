import type {Request, Response} from 'express';
import express from 'express';
import GroupCollection from './collection';
import FreetCollection from '../freet/collection';
import * as groupValidator from './middleware';
import * as userValidator from '../user/middleware';

const router = express.Router();

/**
 * Create a new group.
 *
 * @name POST /api/groups/:groupName
 *
 * @return {GroupResponse} - The created group
 * @throws {403} - If the user is not logged in
 * @throws {409} - If the group name already in use
 */
router.post(
    '/:groupName',
    [
      userValidator.isUserLoggedIn,
      groupValidator.isGroupNameNotInUse
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? '';
      const group = await GroupCollection.createGroup(userId, req.params.groupName);
  
      res.status(201).json({
        message: 'Your group was created successfully.',
        group: group
      });
    }
);

/**
 * Change the name of the group
 *
 * @name PUT /api/groups/:groupName
 *
 * @return {string} - success message
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the groupName is not valid
 */
 router.put(
    '/:groupName',
    [
      userValidator.isUserLoggedIn,
      groupValidator.isGroupExistsName,
    ],
    async (req: Request, res: Response) => {
      const group = await GroupCollection.findGroupByName(req.session.userId, req.params.groupName);
      await GroupCollection.changeName(group._id, req.body.new_name);
      res.status(200).json({
        message: 'The Group Name was successfully changed',
      });
    }
);

/**
 * Add member to the group
 *
 * @name POST /api/groups/:groupName/members/:memberId
 *
 * @return {string} - success message
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the groupName is not valid
 * @throws {404} - if user doesnt exist
 * @throws {403} - if memberId already in group or its the user themselves
 */
 router.post(
    '/:groupName/members/:memberId',
    [
      userValidator.isUserLoggedIn,
      groupValidator.isGroupExistsName,
      groupValidator.isValidMember,
    ],
    async (req: Request, res: Response) => {
      const group = await GroupCollection.findGroupByName(req.session.userId, req.params.groupName);
      await GroupCollection.addMember(group._id, req.params.memberId)
      res.status(200).json({
        message: 'Group member succesfully added',
      });
    }
);

/**
 * Remove member from the group
 *
 * @name DELETE /api/groups/:groupName/members/:memberId
 *
 * @return {string} - success message
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the groupName is not valid
 * @throws {404} - if memberId not in group
 */
 router.delete(
    '/:groupName/members/:memberId',
    [
      userValidator.isUserLoggedIn,
      groupValidator.isGroupExistsName,
      groupValidator.isMemberNotInGroup,
    ],
    async (req: Request, res: Response) => {
      const group = await GroupCollection.findGroupByName(req.session.userId, req.params.groupName);
      await GroupCollection.removeMember(group._id, req.params.memberId)
      res.status(200).json({
        message: 'Group member succesfully removed',
      });
    }
);

/**
 * Delete a Group
 *
 * @name DELETE /api/groups/:groupName
 *
 * @return {string} - success message
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the groupName is not valid
 */
 router.delete(
    '/:groupName',
    [
      userValidator.isUserLoggedIn,
      groupValidator.isGroupExistsName,
    ],
    async (req: Request, res: Response) => {
      const group = await GroupCollection.findGroupByName(req.session.userId, req.params.groupName);
      await GroupCollection.deleteGroup(group._id);
      res.status(200).json({
        message: 'The Group was deleted successfully',
      });
    }
);

/**
 * Get all of users Groups
 *
 * @name GET /api/groups
 *
 * @return {GroupResponse[]} - A list of all the groups
 * @throws {403} - if the user is not logged in
 */
 router.get(
    '/',
    [
        userValidator.isUserLoggedIn,
    ],
    async (req: Request, res: Response) => {
      const allGroups =  await GroupCollection.findallGroupsofUser(req.session.userId);
      res.status(200).json(allGroups);
    }
);

export {router as groupRouter};

import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReactionCollection from './collection';
import * as reactionValidator from './middleware';
import * as freetValidator from '../freet/middleware';
import * as userValidator from '../user/middleware';


const router = express.Router();

/**
 * Get reactions by freet.
 *
 * @name GET GET /api/reaction?freetId=id
 *
 * @return {VoteResponse[]} - An array of votes for freet with id, freetId
 * @throws {404} - If no freet has given freetId
 *
 */
 router.get(
    '/:freetId?',
    [
      freetValidator.isFreetExists
    ],
    async (req: Request, res: Response) => {
      const freetReactions = await ReactionCollection.allReactionsforFreet(req.query.id as string);
      res.status(200).json(freetReactions);
    }
  );

/**
 * React to a freet.
 *
 * @name POST /api/reaction/
 *
 * @return {VoteResponse} - The created vote
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freet does not exist
 * @throws {405} - If freet has already been reacted by user
 */
 router.post(
    '/:freetId?',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isFreetExists,
      reactionValidator.isReactionExists,
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? '';
      const reaction = await ReactionCollection.reaction(userId, req.params.id, req.params.body);
  
      res.status(201).json({
        message: 'Your reaction was saved successfully.',
        reaction: reaction
      });
    }
  );


/**
 * Delete a vote
 *
 * @name DELETE /api/reaction/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the vote
 * @throws {404} - If the voteId is not valid
 */
 router.delete(
    '/:reactionId?',
    [
      userValidator.isUserLoggedIn,
      reactionValidator.isReactionExists,
      reactionValidator.isValidReactionModifier,
    ],
    async (req: Request, res: Response) => {
      await ReactionCollection.deleteReaction(req.params.id);
      res.status(200).json({
        message: 'Your reaction was deleted successfully.'
      });
    }
  );

export {router as ReactionRouter};